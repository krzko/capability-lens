import { useMaturityTemplates } from '@/hooks/useMaturityAssessment';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MaturityTemplateListProps {
  onSelectTemplate: (templateId: string) => void;
}

export function MaturityTemplateList({ onSelectTemplate }: MaturityTemplateListProps) {
  const router = useRouter();
  const { templates, isLoading, error, mutate } = useMaturityTemplates();
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      const response = await fetch(`/api/templates/${templateToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      // Refresh the templates list
      mutate();
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setTemplateToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading maturity templates: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates?.map((template) => (
        <Card key={template.id} className="flex flex-col relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md border transition-colors hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/templates/${template.id}`)}
                  >
                    View Template
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => setTemplateToDelete(template.id)}
                  >
                    Delete Template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Facets:</h4>
              <ul className="list-disc list-inside">
                {template.facets.map((facet) => (
                  <li key={facet.id}>{facet.name}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <div className="p-4 mt-auto">
            <Button
              className="w-full"
              onClick={() => onSelectTemplate(template.id)}
            >
              Select Template
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template) => (
          <Card key={template.id} className="flex flex-col relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md border transition-colors hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setTemplateToDelete(template.id)}
                    >
                      Delete Template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Facets:</h4>
                <ul className="list-disc list-inside">
                  {template.facets.map((facet) => (
                    <li key={facet.id}>{facet.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <div className="p-4 mt-auto">
              <Button
                className="w-full"
                onClick={() => onSelectTemplate(template.id)}
              >
                Select Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
