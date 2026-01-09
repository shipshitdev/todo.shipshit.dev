'use client';

import { useEffect, useState, useCallback } from 'react';
import { useApi } from '@/hooks/use-api';
import { Task, ViewMode } from '@todoist/shared';
import TaskList from '@/components/task-list';
import KanbanBoard from '@/components/kanban-board';
import TaskForm from '@/components/task-form';
import QuickAddTask from '@/components/quick-add-task';
import { Button } from '@shipshitdev/ui';
import { Plus, List, LayoutGrid } from 'lucide-react';

export default function InboxPage() {
  const { tasks: tasksApi } = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await tasksApi.getAll({ completed: false });
      const inboxTasks = allTasks.filter(task => !task.projectId);
      setTasks(inboxTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [tasksApi]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    loadTasks();
  };

  const handleTaskUpdated = () => {
    loadTasks();
  };

  const handleTaskDeleted = () => {
    loadTasks();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inbox</h1>
            <p className="text-muted-foreground text-sm">Tasks without a project</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === ViewMode.LIST ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(ViewMode.LIST)}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === ViewMode.KANBAN ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(ViewMode.KANBAN)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4">
          <QuickAddTask
            onTaskCreated={loadTasks}
            placeholder="Add a task to inbox..."
          />
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Inbox is empty</p>
            <p className="text-sm mt-1">Add a task above or move tasks here from projects</p>
          </div>
        ) : viewMode === ViewMode.LIST ? (
          <TaskList
            tasks={tasks}
            onUpdate={handleTaskUpdated}
            onDelete={handleTaskDeleted}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onUpdate={handleTaskUpdated}
            onDelete={handleTaskDeleted}
          />
        )}
      </div>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
}

