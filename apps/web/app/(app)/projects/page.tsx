'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { Project } from '@todoist/shared';
import { Card, CardContent, CardHeader } from '@agenticindiedev/ui';
import { Button } from '@agenticindiedev/ui';
import { Plus } from 'lucide-react';
import ProjectForm from '@/components/project-form';

export default function ProjectsPage() {
  const { projects: projectsApi } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const allProjects = await projectsApi.getAll();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, [projectsApi]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleProjectCreated = () => {
    setShowProjectForm(false);
    loadProjects();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </CardHeader>
                <CardContent>
                  {project.color && (
                    <div
                      className="w-full h-2 rounded"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          onSuccess={handleProjectCreated}
        />
      )}
    </div>
  );
}

