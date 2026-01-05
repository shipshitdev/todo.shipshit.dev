'use client';

import KanbanBoard from '@/components/kanban-board';
import QuickAddTask from '@/components/quick-add-task';
import TaskForm from '@/components/task-form';
import TaskList from '@/components/task-list';
import { useApi } from '@/hooks/use-api';
import { Button } from '@agenticindiedev/ui';
import { Task, ViewMode } from '@todoist/shared';
import { format } from 'date-fns';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function TodayPage() {
  const { tasks: tasksApi } = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await tasksApi.getAll({ dueDate: today, completed: false });
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [tasksApi, today]);

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
            <h1 className="text-2xl font-bold">Today</h1>
            <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</p>
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
            defaultDueDate={new Date().toISOString()}
            onTaskCreated={loadTasks}
            placeholder="Add a task for today..."
          />
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No tasks for today</p>
            <p className="text-sm mt-1">Add a task above to get started</p>
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
