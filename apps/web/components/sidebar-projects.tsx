'use client';

import { useApi } from '@/hooks/use-api';
import { Button, Input } from '@agenticindiedev/ui';
import { Project, Task } from '@todoist/shared';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProjectWithCount extends Project {
  taskCount: number;
}

export default function SidebarProjects() {
  const { projects: projectsApi, tasks: tasksApi } = useApi();
  const pathname = usePathname();
  const [projects, setProjects] = useState<ProjectWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, tasksData] = await Promise.all([
        projectsApi.getAll(),
        tasksApi.getAll({ completed: false }),
      ]);

      // Count tasks per project
      const projectsWithCounts = projectsData.map((project) => ({
        ...project,
        taskCount: tasksData.filter((task: Task) => task.projectId === project.id).length,
      }));

      setProjects(projectsWithCounts);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, [projectsApi, tasksApi]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddProject = async () => {
    const trimmedName = newProjectName.trim();
    if (!trimmedName || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await projectsApi.create({ name: trimmedName });
      setNewProjectName('');
      setIsAdding(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProject();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsAdding(false);
      setNewProjectName('');
    }
  };

  const isProjectActive = (projectId: string) => {
    return pathname === `/projects/${projectId}`;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between w-full px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span>Projects</span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="mt-1 space-y-1">
          {loading ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div
                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm transition-colors ${
                      isProjectActive(project.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color || '#6b7280' }}
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {project.taskCount > 0 && (
                      <span
                        className={`text-xs ${
                          isProjectActive(project.id)
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {project.taskCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              {projects.length === 0 && !isAdding && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No projects yet
                </div>
              )}

              {isAdding && (
                <div className="px-2">
                  <Input
                    ref={inputRef}
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (!newProjectName.trim()) {
                        setIsAdding(false);
                      }
                    }}
                    disabled={isSubmitting}
                    placeholder="Project name..."
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
