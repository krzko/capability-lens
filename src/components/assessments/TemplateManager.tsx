"use client";

import * as React from 'react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AssessmentPreview } from '@/components/assessments/AssessmentPreview';

import { templateSchema } from '@/types/template-schema';

interface Template {
  id: string;
  name: string;
  description: string | null;
  isCustom: boolean;
  version: string;
}

export function TemplateManager() {
  const [jsonContent, setJsonContent] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      setError('Failed to load templates');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const json = JSON.parse(content);
          templateSchema.parse(json); // Validate against schema
          setJsonContent(content);
          setError(null);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Invalid template format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonContent,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save template');
      }
      
      setSuccessMessage('Template saved successfully');
      setJsonContent('');
      fetchTemplates(); // Refresh template list
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving template');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      const template = await response.json();
      setSelectedTemplate(template);
    } catch (error) {
      setError('Failed to load template details');
    }
  };

  const handleDownloadTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/download`);
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'template.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to download template');
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      const response = await fetch(`/api/templates/${templateToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      setSuccessMessage('Template deleted successfully');
      fetchTemplates(); // Refresh the list
    } catch (error) {
      setError('Failed to delete template');
    } finally {
      setTemplateToDelete(null);
    }
  };

  const renderDeleteDialog = () => {
    if (!templateToDelete) return null;
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <Fragment>
      <div className="space-y-6">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-file">Template JSON File</Label>
              <Input
                id="template-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="mt-1"
                disabled={loading}
              />
            </div>
            {jsonContent && (
              <Button
                onClick={handleSaveTemplate}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Template
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md border transition-colors hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewTemplate(template.id)}
                          >
                            View Template
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadTemplate(template.id)}
                          >
                            Download
                          </DropdownMenuItem>
                          {template.isCustom && (
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setTemplateToDelete(template.id)}
                            >
                              Delete Template
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {template.description && (
                      <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">v{template.version}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

      {renderDeleteDialog()}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] xl:w-[70vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg">Template Preview</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          {selectedTemplate && <AssessmentPreview template={selectedTemplate} />}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
