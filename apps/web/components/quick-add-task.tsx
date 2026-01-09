'use client';

import { useApi } from '@/hooks/use-api';
import { Input } from '@shipshitdev/ui';
import { CreateTaskDto, TaskPriority } from '@todoist/shared';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

interface QuickAddTaskProps {
  projectId?: string;
  defaultDueDate?: string;
  onTaskCreated: () => void;
  placeholder?: string;
}

export default function QuickAddTask({
  projectId,
  defaultDueDate,
  onTaskCreated,
  placeholder = 'Add a task...',
}: QuickAddTaskProps) {
  const { tasks: tasksApi } = useApi();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const taskData: CreateTaskDto = {
        title: trimmedTitle,
        priority: TaskPriority.MEDIUM,
      };

      if (projectId) {
        taskData.projectId = projectId;
      }

      if (defaultDueDate) {
        taskData.dueDate = defaultDueDate;
      }

      await tasksApi.create(taskData);
      setTitle('');
      onTaskCreated();
      // Keep focus for continuous entry
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTitle('');
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
        isFocused
          ? 'border-primary bg-card shadow-sm'
          : 'border-dashed border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
    >
      <Plus
        className={`h-5 w-5 transition-colors ${
          isFocused ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isSubmitting}
        placeholder={placeholder}
        className="border-0 bg-transparent p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {title.trim() && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Press Enter to add
        </span>
      )}
    </div>
  );
}
