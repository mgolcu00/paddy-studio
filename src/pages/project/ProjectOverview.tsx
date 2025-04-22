import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Project, Page } from '@/types';
import { getProject, getPages, createPage, deletePage } from '@/services/projectService';
import {
  ArrowLeftIcon, PlusIcon, Trash2Icon, FileIcon, MoreHorizontalIcon, PencilIcon, EyeIcon 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPageName, setNewPageName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      // Fetch project and pages in parallel for better performance
      const [projectData, pagesData] = await Promise.all([
        getProject(projectId),
        getPages(projectId)
      ]);
      console.log(projectData + " " + currentUser + " " + projectData?.userId);

      if (projectData && currentUser && projectData.userId === currentUser.id) {
        setProject(projectData);
        // Sort pages, maybe by name or creation date?
        pagesData.sort((a, b) => a.name.localeCompare(b.name));
        setPages(pagesData);
      } else {
        toast({ title: 'Access denied', /*...*/ variant: 'destructive' });
        navigate('/console');
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast({ title: 'Error fetching project', /*...*/ variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !projectId) return;
    try {
      const newPage = await createPage(projectId, newPageName);
      // Add and resort pages
      const updatedPages = [...pages, newPage].sort((a, b) => a.name.localeCompare(b.name));
      setPages(updatedPages);
      setNewPageName('');
      setIsDialogOpen(false);
      toast({ title: 'Page created', /*...*/ });
      // Optional: Navigate to the new page editor directly
      // navigate(`/console/${projectId}/${newPage.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      toast({ title: 'Error creating page', /*...*/ variant: 'destructive' });
    }
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    // Consider using Shadcn AlertDialog for confirmation
    if (!window.confirm(`Are you sure you want to delete the page "${pageName}"?`)) {
      return;
    }
    try {
      await deletePage(pageId);
      setPages(pages.filter(page => page.id !== pageId));
      toast({ title: 'Page deleted', /*...*/ });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({ title: 'Error deleting page', /*...*/ variant: 'destructive' });
    }
  };

  // --- Render Logic --- 

  if (isLoading) {
    // Basic loading state centered
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    // Project not found or access denied state
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">Could not load project details or access denied.</p>
        <Button asChild variant="outline">
          <Link to="/console">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header with back button, project name, and new page button */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link to="/console">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {project.name}
        </h1>
        {/* Optional: Add project stats or description here */}
        <div className="ml-auto flex items-center gap-2">
           {/* New Page Dialog Trigger */}
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>
                  Enter a name for your new page within the "{project.name}" project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <Input
                    id="name"
                    placeholder="e.g., About Us, Contact"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    className="col-span-3"
                  />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePage} disabled={!newPageName.trim()}>
                  Create Page
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main content area for page list */}
      <main className="container mx-auto py-8 px-4 sm:px-6">
         {/* Using Table for page list */} 
         <div className="border rounded-lg">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Page Name</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Last Updated</TableHead>
                 <TableHead><span className="sr-only">Actions</span></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {pages.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                     No pages created yet.
                   </TableCell>
                 </TableRow>
               ) : (
                 pages.map((page) => (
                   <TableRow key={page.id}>
                     <TableCell className="font-medium">
                       <Link to={`/console/editor/${projectId}/${page.id}`} className="hover:underline">
                         {page.name}
                       </Link>
                     </TableCell>
                     <TableCell>
                       <Badge variant={page.status === 'published' ? 'default' : 'outline'} className={page.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
                         {page.status === 'published' ? 'Published' : 'Draft'}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                     </TableCell>
                     <TableCell className="text-right">
                       {/* Action Menu for each page */}
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontalIcon className="h-4 w-4" />
                             <span className="sr-only">Page Actions</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <Link to={`/console/editor/${projectId}/${page.id}`} className="flex items-center cursor-pointer">
                                <PencilIcon className="h-4 w-4 mr-2" /> Edit
                              </Link>
                           </DropdownMenuItem>
                           {/* Optional: Add Preview link if pages have public URLs */} 
                           {/* {page.status === 'published' && (
                             <DropdownMenuItem asChild>
                               <a href={`/preview/${projectId}/${page.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                 <EyeIcon className="h-4 w-4 mr-2" /> Preview
                               </a>
                             </DropdownMenuItem>
                           )} */} 
                           <DropdownMenuItem 
                             className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center"
                             onClick={() => handleDeletePage(page.id, page.name)}
                           >
                             <Trash2Icon className="h-4 w-4 mr-2" /> Delete Page
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))
               )}
             </TableBody>
           </Table>
         </div>
      </main>
    </div>
  );
}