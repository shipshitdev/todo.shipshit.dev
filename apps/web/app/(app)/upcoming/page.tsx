'use client';

import { useEffect, useState, useCallback } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { useApi } from '@/hooks/use-api';
import { Task } from '@todoist/shared';
import TaskList from '@/components/task-list';
import { Card, CardContent, CardHeader } from '@agenticindiedev/ui';

export default function UpcomingPage() {
  const { tasks: tasksApi } = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await tasksApi.getAll({ completed: false });
      const upcomingTasks = allTasks.filter(task => task.dueDate);
      setTasks(upcomingTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [tasksApi]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const groupTasksByDate = (tasks: Task[]) => {
    const grouped: { [key: string]: Task[] } = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate;
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = addDays(today, 1);

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, tomorrow)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const groupedTasks = groupTasksByDate(tasks);
  const sortedDates = Object.keys(groupedTasks).sort();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Upcoming</h1>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {sortedDates.length === 0 ? (
          <p className="text-muted-foreground">No upcoming tasks</p>
        ) : (
          sortedDates.map(dateKey => (
            <Card key={dateKey}>
              <CardHeader>
                <h3 className="text-lg font-semibold">{getDateLabel(dateKey)}</h3>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={groupedTasks[dateKey]}
                  onUpdate={loadTasks}
                  onDelete={loadTasks}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

