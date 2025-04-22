import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Project, User } from '@/types';
import { createProject, getProjects, deleteProject } from '@/services/projectService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, Trash2Icon, FolderIcon, LogOutIcon, MoreVerticalIcon, PencilIcon, SearchIcon, 
  SettingsIcon,
  LayoutGridIcon,
  HomeIcon,
  UserCircleIcon,
  ChevronDownIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

// --- Sidebar Navigation Component (Example Structure) ---
interface SidebarNavProps {
  currentUser: User | null | undefined;
  onLogout: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const getLinkClass = (path: string) => {
    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      location.pathname === path && "bg-muted text-primary"
    );
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64 fixed left-0 top-0 h-full z-40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/console" className="flex items-center gap-2 font-semibold">
            <HomeIcon className="h-6 w-6 text-primary" /> 
            <span className="">Paddy Studio</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            <Link to="/console" className={getLinkClass('/console')}>
              <LayoutGridIcon className="h-4 w-4" />
              Projeler
            </Link>
            <Link to="/console/settings" className={getLinkClass('/console/settings')}>
              <SettingsIcon className="h-4 w-4" />
              Ayarlar
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-left h-auto px-3 py-2">
                <UserCircleIcon className="h-6 w-6 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</p> 
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
                <ChevronDownIcon className="h-4 w-4 ml-2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 mb-1">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link to="/console/settings">Profil & Ayarlar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Destek</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                 <LogOutIcon className="h-4 w-4 mr-2" /> Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export function UserDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const projectsList = await getProjects(currentUser.id);
      projectsList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({ title: 'Projeler Yüklenemedi', description: 'Projelerinizi yüklerken bir hata oluştu. Lütfen tekrar deneyin.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !currentUser?.id) return;
    try {
      const newProject = await createProject(currentUser.id, newProjectName);
      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setIsDialogOpen(false);
      toast({ title: 'Proje Oluşturuldu', description: `"${newProjectName}" başarıyla oluşturuldu.` });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({ title: 'Proje Oluşturulamadı', description: 'Proje oluşturulurken bir hata oluştu.', variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!window.confirm(`"${projectName}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
      toast({ title: 'Proje Silindi', description: `"${projectName}" başarıyla silindi.` });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({ title: 'Proje Silinemedi', description: 'Proje silinirken bir hata oluştu.', variant: 'destructive' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Çıkış Yapıldı', description: 'Başarıyla çıkış yaptınız.' });
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({ title: 'Çıkış Hatası', description: 'Çıkış yapılırken bir hata oluştu.', variant: 'destructive' });
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return projects;
    }
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const formatRelativeDate = (dateInput: string | number | Date) => {
     try {
       const date = typeof dateInput === 'number' ? new Date(dateInput) : dateInput instanceof Date ? dateInput : new Date(dateInput);
       if (isNaN(date.getTime())) {
          return "Invalid date";
       }
       return formatDistanceToNow(date, { addSuffix: true });
     } catch (e) {
       console.error("Error formatting date:", e, "Input:", dateInput);
       return "Invalid date";
     }
  };

  return (
    <TooltipProvider>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNav currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Projelerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[350px] shadow-sm"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-4">
                <PlusIcon className="h-4 w-4 mr-2" />
                Yeni Proje
              </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                 <DialogTitle>Yeni Proje Oluştur</DialogTitle>
                 <DialogDescription>
                   Yeni şaheseriniz için bir isim girin.
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <Input
                     id="name"
                     placeholder="Harika Web Sitem"
                     value={newProjectName}
                     onChange={(e) => setNewProjectName(e.target.value)}
                     className="col-span-3"
                   />
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                   İptal
                 </Button>
                 <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                   Oluştur
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </header>

        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden shadow-sm">
                  <CardHeader className="p-4">
                     <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                     <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader> 
                  <CardContent className="p-4 pt-0">
                      <div className="h-16 bg-muted/50 rounded"></div>
                  </CardContent>
                  <CardFooter className="p-4 pt-2 flex justify-end">
                     <div className="h-8 bg-muted rounded w-10"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 border-2 border-dashed border-border rounded-lg bg-background/50">
              <FolderIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6 opacity-50" />
              <h3 className="text-xl font-semibold mb-3">
                {searchTerm ? 'Proje Bulunamadı' : 'Henüz Projeniz Yok'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? `"${searchTerm}" aramasıyla eşleşen proje bulunamadı.`
                  : "Harika bir şey inşa etmeye hazır mısınız? İlk projenizi şimdi oluşturun!"
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)} size="lg">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  İlk Projeni Oluştur
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                     <div className="flex-1 space-y-1">
                        <Link to={`/console/${project.id}`} className="group">
                           <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{project.name || 'İsimsiz Proje'}</CardTitle>
                        </Link>
                        <CardDescription className="text-xs">
                           Güncellendi: {formatRelativeDate(project.updatedAt)}
                        </CardDescription>
                     </div>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 flex-none -mr-2 -mt-1 text-muted-foreground hover:text-foreground">
                            <Tooltip>
                               <TooltipTrigger asChild>
                                  <MoreVerticalIcon className="h-4 w-4" />
                               </TooltipTrigger>
                               <TooltipContent side="top"><p>Seçenekler</p></TooltipContent>
                            </Tooltip>
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem asChild>
                            <Link to={`/console/${project.id}`} className="flex items-center cursor-pointer">
                              <FolderIcon className="h-4 w-4 mr-2" /> Projeyi Aç
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                           className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center cursor-pointer"
                           onClick={() => handleDeleteProject(project.id, project.name)}
                         >
                           <Trash2Icon className="h-4 w-4 mr-2" /> Sil
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}