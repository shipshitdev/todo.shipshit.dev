'use client';

import { useApi } from '@/hooks/use-api';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from '@agenticindiedev/ui';
import * as Select from '@radix-ui/react-select';
import { CreateTaskDto, Project, Task, TaskPriority, UpdateTaskDto } from '@todoist/shared';
import { useCallback, useEffect, useState } from 'react';

interface TaskFormProps {
  task?: Task;
  projectId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskForm({ task, projectId, onClose, onSuccess }: TaskFormProps) {
  const { tasks: tasksApi, projects: projectsApi } = useApi();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [selectedProjectId, setSelectedProjectId] = useState(task?.projectId || projectId || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
  );
  const [dueTime, setDueTime] = useState(
    task?.dueDate ? new Date(task.dueDate).toTimeString().slice(0, 5) : ''
  );
  const [priority, setPriority] = useState<TaskPriority>(
    (task?.priority as TaskPriority) || TaskPriority.MEDIUM
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const allProjects = await projectsApi.getAll();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, [projectsApi]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const dueDateTime = dueDate && dueTime
        ? new Date(`${dueDate}T${dueTime}`).toISOString()
        : dueDate
        ? new Date(`${dueDate}T00:00`).toISOString()
        : undefined;

      if (task) {
        const updateData: UpdateTaskDto = {
          title,
          description: description || undefined,
          projectId: selectedProjectId || undefined,
          dueDate: dueDateTime,
          priority,
        };
        await tasksApi.update(task.id, updateData);
      } else {
        const createData: CreateTaskDto = {
          title,
          description: description || undefined,
          projectId: selectedProjectId || undefined,
          dueDate: dueDateTime,
          priority,
        };
        await tasksApi.create(createData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="project">Project</Label>
            <Select.Root value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <Select.Value placeholder="Select project" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                  <Select.Viewport className="p-1">
                    <Select.Item value="" className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                      <Select.ItemText>None (Inbox)</Select.ItemText>
                    </Select.Item>
                    {projects.map(project => (
                      <Select.Item key={project.id} value={project.id} className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                        <Select.ItemText>{project.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dueTime">Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select.Root value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <Select.Value />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                  <Select.Viewport className="p-1">
                    <Select.Item value={TaskPriority.LOW} className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                      <Select.ItemText>Low</Select.ItemText>
                    </Select.Item>
                    <Select.Item value={TaskPriority.MEDIUM} className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                      <Select.ItemText>Medium</Select.ItemText>
                    </Select.Item>
                    <Select.Item value={TaskPriority.HIGH} className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                      <Select.ItemText>High</Select.ItemText>
                    </Select.Item>
                    <Select.Item value={TaskPriority.URGENT} className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent">
                      <Select.ItemText>Urgent</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

