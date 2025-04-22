import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Component, Page, Project, ComponentID, ComponentType } from '@/types';
import { getProject, getPage, getPages, updatePageComponents, publishPage, createPage } from '@/services/projectService';
import { ArrowLeftIcon, SaveIcon, UploadCloudIcon, CheckCircleIcon, PlusCircleIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon, ExternalLinkIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { ComponentPalette } from '@/components/ui-components/ComponentPalette';
import { Canvas } from '@/components/ui-components/Canvas';
import { PropertyEditor } from '@/components/ui-components/PropertyEditor';
import { LayerView } from '@/components/ui-components/LayerView';
import { JsonPreview } from '@/components/ui-components/JsonPreview';
import { ComponentRenderer } from '@/components/ui-components/ComponentRenderer';
import { createDefaultComponent } from '@/lib/defaultComponents';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    findComponentLocation,
    insertComponent,
    isLayoutComponent,
    removeComponentById,
    findParentComponent
} from '@/lib/componentUtils';

export function EditorPage() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<ComponentID | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeId, setActiveId] = useState<ComponentID | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEditorData = useCallback(async () => {
    if (!projectId || !pageId) return;

    setIsLoading(true);
    console.log(`fetchEditorData: Attempting to fetch project ${projectId} and page ${pageId}`);
    try {
      const [projectData, pageData] = await Promise.all([
        getProject(projectId),
        getPage(pageId)
      ]);

      console.log("fetchEditorData: Fetched projectData:", projectData);
      console.log("fetchEditorData: Fetched pageData:", pageData);

      if (!projectData) {
        toast({ title: 'Proje Bulunamadı', variant: 'destructive' });
        navigate('/console'); return;
      }
      if (!currentUser || projectData.userId !== currentUser.id) {
        toast({ title: 'Erişim Reddedildi', description: 'Bu projeyi görüntüleme izniniz yok.', variant: 'destructive' });
        navigate('/console'); return;
      }

      if (!pageData || pageData.projectId !== projectId) {
        toast({ title: 'Sayfa Bulunamadı', description: 'Bu sayfaya erişilemiyor veya projeye ait değil.', variant: 'destructive' });
        navigate(`/console/${projectId}`); return;
      }

      setProject(projectData);
      setPage(pageData);
      setComponents(pageData.components || []);
      setSelectedComponentId(null);
      setSelectedComponent(null);

      getPages(projectId)
        .then(allPages => setPages(allPages.sort((a, b) => a.name.localeCompare(b.name))))
        .catch(err => console.error("Error fetching all pages for dropdown:", err));

    } catch (error) {
      console.error("Error fetching editor data:", error);
      toast({ title: 'Veri Yüklenirken Hata Oluştu', variant: 'destructive' });
      navigate('/console');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, pageId, currentUser, navigate, toast]);

  useEffect(() => {
    if (!projectId || !pageId) {
      console.warn("EditorPage: projectId or pageId missing in initial render/params.");
      setIsLoading(false);
      return;
    }
    fetchEditorData();
  }, [fetchEditorData]);

  useEffect(() => {
    if (selectedComponentId && components.length > 0) {
      const { component: found } = findComponentLocation(components, selectedComponentId);
      setSelectedComponent(found);
    } else {
      setSelectedComponent(null);
    }
  }, [selectedComponentId, components]);

  const handlePageChange = (newPageId: string) => {
    if (newPageId && newPageId !== pageId) {
      navigate(`/console/editor/${projectId}/${newPageId}`);
    }
  };

  const handleCreateNewPage = async () => {
    if (!projectId || !newPageName.trim()) {
      toast({ title: "Geçersiz Sayfa Adı", description: "Lütfen bir sayfa adı girin." });
      return;
    }

    if (pages.some(p => p.name.toLowerCase() === newPageName.trim().toLowerCase())) {
      toast({ title: "Sayfa Adı Kullanımda", description: "Lütfen farklı bir sayfa adı girin.", variant: "destructive" });
      return;
    }

    try {
      const createdPage = await createPage(projectId, newPageName.trim());
      toast({ title: "Sayfa Oluşturuldu", description: `"${createdPage.name}" başarıyla eklendi.` });
      setNewPageName('');
      setIsCreatePageOpen(false);
      getPages(projectId)
          .then(allPages => {
              setPages(allPages.sort((a, b) => a.name.localeCompare(b.name)));
              navigate(`/console/editor/${projectId}/${createdPage.id}`);
          })
          .catch(err => console.error("Error refetching pages after creation:", err));

    } catch (error) {
      console.error("Error creating page:", error);
      toast({ title: "Sayfa Oluşturulamadı", variant: "destructive" });
    }
  };

  const handleDeletePage = async (pageToDelete: Page) => {
    if (!projectId) return;
    if (pages.length <= 1) {
      toast({ title: "Silinemez", description: "Projelerde en az bir sayfa kalmalıdır.", variant: "destructive" });
      return;
    }

    try {
      console.log(`TODO: Implement deletePage API call for page ID: ${pageToDelete.id}`);
      toast({ title: "Sayfa Silindi", description: `"${pageToDelete.name}" silindi.` });

      const remainingPages = pages.filter(p => p.id !== pageToDelete.id);
      setPages(remainingPages.sort((a, b) => a.name.localeCompare(b.name)));

      if (page?.id === pageToDelete.id) {
        if (remainingPages.length > 0) {
          navigate(`/console/editor/${projectId}/${remainingPages[0].id}`);
        } else {
          navigate(`/console/${projectId}`);
        }
      }

    } catch (error) {
      console.error("Error deleting page:", error);
      toast({ title: "Sayfa Silinemedi", variant: "destructive" });
    }
  };

  const handleComponentSelect = useCallback((id: ComponentID) => {
    setSelectedComponentId(id);
  }, []);

  const handleComponentUpdate = useCallback((updatedComponent: Component) => {
    const updateRecursive = (componentList: Component[]): Component[] => {
      let listChanged = false;

      const newList = componentList.map(comp => {
        if (comp.id === updatedComponent.id) {
          listChanged = true;
          return updatedComponent;
        }

        if ('children' in comp && Array.isArray(comp.children)) {
          const originalChildren = comp.children;
          const newChildren = updateRecursive(originalChildren);

          if (newChildren !== originalChildren) {
            listChanged = true;
            return { ...comp, children: newChildren };
          }
        }

        return comp;
      });

      return listChanged ? newList : componentList;
    };

    setComponents(prevComponents => updateRecursive(prevComponents));
  }, []);

  const handleComponentDelete = useCallback((id: ComponentID) => {
    setComponents(prevComponents => removeComponentById(prevComponents, id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const handleSave = useCallback(async () => {
    if (!pageId) return;
    setIsSaving(true);
    try {
      await updatePageComponents(pageId, components);
      toast({
        title: 'Kaydedildi',
        description: 'Sayfa değişiklikleriniz başarıyla kaydedildi.'
      });
      setPage(p => p ? { ...p, updatedAt: Date.now() } : null);
    } catch (error) {
      console.error("Save Error:", error);
      toast({
        title: 'Kaydetme Hatası',
        description: 'Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [pageId, components, toast]);

  const handlePublish = useCallback(async () => {
    if (!pageId || page?.status === 'published') return;
    setIsPublishing(true);
    try {
      await publishPage(pageId);
      setPage(p => p ? { ...p, status: 'published', updatedAt: Date.now() } : null);
      toast({
        title: 'Sayfa Yayınlandı',
        description: 'Sayfanız başarıyla yayınlandı ve artık canlı.'
      });
    } catch (error) {
      console.error("Publish Error:", error);
      toast({
        title: 'Yayınlama Hatası',
        description: 'Sayfa yayınlanamadı. Lütfen tekrar deneyin.',
        variant: 'destructive'
      });
    } finally {
      setIsPublishing(false);
    }
  }, [pageId, page?.status, toast]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const currentActiveId = active.id as ComponentID;
    setActiveId(currentActiveId);

    if (active.data.current?.isPaletteItem) {
      const type = active.data.current?.type as ComponentType | undefined;
      if (type) {
        setDraggedComponent(createDefaultComponent(type));
      } else {
        setDraggedComponent(null);
      }
    } else {
      const { component } = findComponentLocation(components, currentActiveId);
      setDraggedComponent(component);
    }
  }, [components]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedComponent(null);

    if (!over || !active) {
        console.log("DragEnd: Cancelled (no active or over element).");
        return;
    }

    const activeId = active.id as ComponentID;
    const overId = over.id as ComponentID | 'canvas-root';
    const isPaletteItem = active.data.current?.isPaletteItem ?? false;

    console.log(`Drag End: Active=${activeId}, Over=${overId}, IsPalette=${isPaletteItem}`);

    if (isPaletteItem) {
      const type = active.data.current?.type as ComponentType | undefined;
      if (!type) return;
      
      const newComponent = createDefaultComponent(type);
      let targetParentId: ComponentID | 'canvas-root' = 'canvas-root';
      let targetIndex: number = components.length;

      if (overId !== 'canvas-root') {
        const { component: overComponent } = findComponentLocation(components, overId);

        if (overComponent) {
          if (isLayoutComponent(overComponent.type) && 'children' in overComponent && Array.isArray(overComponent.children)) {
            targetParentId = overComponent.id;
            targetIndex = overComponent.children.length;
            console.log(`Palette Drop: Target layout container ${targetParentId}, index ${targetIndex}`);
          }
          else {
             const parentComponent = findParentComponent(components, overId);
             if (parentComponent && 'children' in parentComponent && Array.isArray(parentComponent.children)) {
                 targetParentId = parentComponent.id;
                 const overIndex = parentComponent.children.findIndex(c => c.id === overId);
                 targetIndex = overIndex >= 0 ? overIndex + 1 : parentComponent.children.length;
                 console.log(`Palette Drop: Target parent container ${targetParentId} after index ${overIndex}`);
             } else {
                 targetParentId = 'canvas-root';
                 const { index: overIndex } = findComponentLocation(components, overId);
                 targetIndex = overIndex >= 0 ? overIndex + 1 : components.length;
                 console.log(`Palette Drop: Target root after index ${overIndex}`);
             }
          }
        } else {
          console.warn(`Palette Drop: Could not find overComponent ID ${overId}, dropping at root end.`);
          targetParentId = 'canvas-root';
          targetIndex = components.length;
        }
      } else {
         console.log(`Palette Drop: Target root canvas, index ${targetIndex}`);
         targetParentId = 'canvas-root';
         targetIndex = components.length;
      }

      if (targetParentId === 'canvas-root' && isLayoutComponent(newComponent.type)) {
          const rootHasLayout = components.some(c => isLayoutComponent(c.type));
          if (rootHasLayout) {
              toast({
                  title: 'Yerleşim Kısıtlaması',
                  description: 'Kök dizine yalnızca bir adet ana yerleşim bileşeni ekleyebilirsiniz.',
              });
              return;
          }
      }
      if (targetParentId === 'canvas-root' && !isLayoutComponent(newComponent.type)) {
          const rootLayout = components.find(c => isLayoutComponent(c.type));
          if (rootLayout && 'children' in rootLayout && Array.isArray(rootLayout.children)) {
              targetParentId = rootLayout.id;
              targetIndex = rootLayout.children.length;
              console.log(`Palette Drop: Redirected non-layout component to root layout container ${targetParentId}`);
              toast({
                  title: "Yönlendirildi",
                  description: `Bileşen, kök dizindeki mevcut '${rootLayout.type}' bileşenine eklendi.`,
              });
          }
      }

      setComponents(prev => insertComponent(prev, newComponent, targetParentId, targetIndex));
      setSelectedComponentId(newComponent.id);
      return;
    }

    if (activeId !== overId) {
      const { component: activeComponent, parentContainer: activeParentContainer, index: activeIndex } = findComponentLocation(components, activeId);

      if (!activeComponent || !activeParentContainer) {
        console.error(`Move Error: Could not find active component (${activeId}) or its parent container.`);
        return;
      }

      let targetParentId: ComponentID | 'canvas-root' = 'canvas-root';
      let targetIndex: number;

      if (overId === 'canvas-root') {
        targetParentId = 'canvas-root';
        targetIndex = components.length;
        console.log(`Move: Target root canvas, index ${targetIndex}`);
      }
      else {
        const { component: overComponent } = findComponentLocation(components, overId);
        if (!overComponent) {
          console.error(`Move Error: Could not find over component (${overId}). Cancelling move.`);
          return;
        }

        if (isLayoutComponent(overComponent.type) && 'children' in overComponent && Array.isArray(overComponent.children)) {
          if (overComponent.id === activeId) {
             console.log("Move: Cannot drop component onto itself.");
             return;
          }

          targetParentId = overComponent.id;
          targetIndex = overComponent.children.length;
          console.log(`Move: Target layout container ${targetParentId}, index ${targetIndex}`);
        }
        else {
          const parentComponent = findParentComponent(components, overId);
          if (parentComponent && 'children' in parentComponent && Array.isArray(parentComponent.children)) {
             targetParentId = parentComponent.id;
             const overIndex = parentComponent.children.findIndex(c => c.id === overId);
             targetIndex = overIndex >= 0 ? overIndex + 1 : parentComponent.children.length;
             console.log(`Move: Target parent container ${targetParentId} after index ${overIndex}`);
          } else {
             targetParentId = 'canvas-root';
             const { index: overIndex } = findComponentLocation(components, overId);
             targetIndex = overIndex >= 0 ? overIndex + 1 : components.length;
             console.log(`Move: Target root after index ${overIndex}`);
          }
        }
      }

      if (targetParentId === 'canvas-root') {
           const isMovingLayoutToRoot = isLayoutComponent(activeComponent.type);
           const rootComponents = (targetParentId === 'canvas-root')
               ? components.filter(c => c.id !== activeId)
               : [];

           if (isMovingLayoutToRoot && rootComponents.some(c => isLayoutComponent(c.type))) {
               toast({
                   title: 'Yerleşim Kısıtlaması',
                   description: 'Kök dizine yalnızca bir adet ana yerleşim bileşeni taşıyabilirsiniz.',
               });
               return;
           }

           const rootLayout = rootComponents.find(c => isLayoutComponent(c.type));
           if (!isMovingLayoutToRoot && rootLayout) {
                toast({
                    title: 'Yerleşim Kısıtlaması',
                    description: `Kök dizinde bir yerleşim bileşeni (${rootLayout.type}) varken, diğer bileşenleri doğrudan kök dizine taşıyamazsınız. Lütfen yerleşim bileşeninin içine taşıyın.`,
                });
                return;
           }
       }

      setComponents(prevComponents => {
        const componentsWithoutActive = removeComponentById(prevComponents, activeId);
        return insertComponent(componentsWithoutActive, activeComponent, targetParentId, targetIndex);
      });

    } else {
      console.log("DragEnd: Active and Over are the same. No move needed.");
    }

  }, [components, toast]);

  const isPublished = page?.status === 'published';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         Yükleniyor...
      </div>
    );
  }

  if (!project || !page) {
    const errorTitle = !project ? "Proje Yüklenemedi" : "Sayfa Yüklenemedi";
    const backLink = !project ? "/console" : `/console/${projectId}`;
    const backLinkText = !project ? "Konsola Dön" : "Projeye Dön";

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 border rounded-lg shadow-md bg-card">
          <h2 className="text-2xl font-bold mb-4 text-destructive">{errorTitle}</h2>
          <p className="text-muted-foreground mb-6">
              { !project
                ? "Proje bilgileri alınamadı veya erişim izniniz yok."
                : "Sayfa bilgileri alınamadı veya bu projeye ait değil."
              }
          </p>
          <Button asChild>
            <Link to={backLink}>{backLinkText}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-screen min-h-screen bg-background text-foreground overflow-hidden">
          <div className="w-64 flex-none border-r border-border flex flex-col">
             <div className="p-4 border-b border-border flex-none">
                 <Button variant="ghost" size="sm" asChild className="mb-4 text-sm w-full justify-start">
                     <Link to={`/console/${projectId}`}><ArrowLeftIcon className="h-4 w-4 mr-2 flex-shrink-0" /> Projeye Dön</Link>
                 </Button>
             </div>
             <div className="flex-1 overflow-y-auto p-4">
                 <Tabs defaultValue="components" className="w-full flex flex-col h-full">
                     <TabsList className="grid w-full grid-cols-2 flex-none">
                         <TabsTrigger value="components">Bileşenler</TabsTrigger>
                         <TabsTrigger value="layers">Katmanlar</TabsTrigger>
                     </TabsList>

                     <TabsContent value="components" className="mt-4 flex-1 overflow-y-auto">
                         <ComponentPalette />
                     </TabsContent>

                     <TabsContent value="layers" className="mt-4 flex-1 overflow-y-auto">
                         <LayerView
                             components={components}
                             selectedComponentId={selectedComponentId}
                             onSelect={handleComponentSelect}
                         />
                     </TabsContent>
                 </Tabs>
             </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 py-3 flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 min-w-[150px] max-w-[300px] justify-between">
                    <span className="truncate" title={page.name}>{page.name}</span>
                    <ChevronsUpDownIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[250px]">
                  <DropdownMenuLabel>Sayfalar</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {pages.map(p => (
                    <DropdownMenuItem key={p.id} onClick={() => handlePageChange(p.id)} disabled={p.id === pageId} className="flex justify-between items-center">
                      <span>{p.name}</span>
                       {p.id === pageId && <CheckCircleIcon className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                     <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsCreatePageOpen(true); }}>
                        <PlusCircleIcon className="h-4 w-4 mr-2" /> Yeni Sayfa Oluştur
                     </DropdownMenuItem>
                  </DialogTrigger>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => navigate(`/console/${projectId}`)}>
                       <ArrowLeftIcon className="h-4 w-4 mr-2" /> Proje Genel Görünümü
                   </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Badge variant={isPublished ? "default" : "outline"} className={`ml-2 ${isPublished ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700" : "border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400"}`}>
                {isPublished ? <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" /> : null}
                {isPublished ? 'Yayınlandı' : 'Taslak'}
              </Badge>

              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                {isPublished && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/preview/${project.id}/${page.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="h-4 w-4 mr-2" /> Önizle
                    </a>
                  </Button>
                )}
                <Button onClick={handleSave} disabled={isSaving || isPublishing} size="sm">
                  <SaveIcon className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button onClick={handlePublish} disabled={isPublished || isPublishing || isSaving} size="sm" variant={isPublished ? "secondary" : "default"}>
                  <UploadCloudIcon className={`h-4 w-4 mr-2 ${isPublishing ? 'animate-pulse' : ''}`} />
                  {isPublishing ? 'Yayınlanıyor...' : (isPublished ? 'Tekrar Yayınla' : 'Yayınla')}
                </Button>
                {pages.length > 1 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Sayfayı Sil" disabled={isSaving || isPublishing}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sayfayı Sil?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "<span className="font-semibold">{page.name}</span>" sayfasını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePage(page)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Evet, Sil</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/40">
              <Canvas
                components={components}
                selectedComponentId={selectedComponentId}
                onComponentSelect={handleComponentSelect}
                onComponentsChange={setComponents}
              />
            </div>
          </div>

          <div className="w-80 flex-none border-l border-border flex flex-col">
            <Tabs defaultValue="properties" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 flex-none">
                <TabsTrigger value="properties">Özellikler</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1 overflow-y-auto p-4">
                {selectedComponent ? (
                  <PropertyEditor
                    key={selectedComponent.id}
                    component={selectedComponent}
                    onChange={handleComponentUpdate}
                    onDelete={() => handleComponentDelete(selectedComponent.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground text-sm">Düzenlemek için bir bileşen seçin veya tuvale yeni bir tane sürükleyin.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="json" className="flex-1 overflow-y-auto p-4 bg-muted/20">
                 <h3 className="text-sm font-medium mb-2">Sayfa Yapısı (JSON)</h3>
                 <JsonPreview components={components} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId && draggedComponent ? (
            <div className="bg-white rounded shadow-lg opacity-80 border p-1 cursor-grabbing">
              <ComponentRenderer component={draggedComponent} isPreview={true} />
            </div>
          ) : null}
        </DragOverlay>

        <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Sayfa Oluştur</DialogTitle>
              <DialogDescription>
                Projenize yeni bir sayfa ekleyin. Benzersiz bir ad seçin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="page-name"
                placeholder="Örn: Ana Sayfa, İletişim"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                className="col-span-3"
                aria-label="Yeni sayfa adı"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreatePageOpen(false); setNewPageName(''); }}>İptal</Button>
              <Button onClick={handleCreateNewPage} disabled={!newPageName.trim() || pages.some(p => p.name.toLowerCase() === newPageName.trim().toLowerCase())}>
                 Oluştur
              </Button>
            </DialogFooter>
            {pages.some(p => p.name.toLowerCase() === newPageName.trim().toLowerCase()) && newPageName.trim() && (
                <p className="text-sm text-destructive mt-2">Bu sayfa adı zaten kullanılıyor.</p>
            )}
          </DialogContent>
        </Dialog>

      </DndContext>
    </TooltipProvider>
  );
}