'use client';

import { Task } from '@todoist/shared';
import TaskItem from './task-item';

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No tasks</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

