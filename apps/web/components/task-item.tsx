'use client';

import { useApi } from '@/hooks/use-api';
import { Button, Checkbox, Input } from '@agenticindiedev/ui';
import { formatTaskDueDate, isOverdue, Task } from '@todoist/shared';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TaskForm from './task-form';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const { tasks: tasksApi } = useApi();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleToggleComplete = async () => {
    try {
      setIsCompleting(true);
      await tasksApi.update(task.id, {
        completedAt: task.completedAt ? null : new Date().toISOString(),
      });
      // Small delay for animation before removing from list
      setTimeout(() => {
        onUpdate();
      }, 300);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        await tasksApi.delete(task.id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleInlineEditStart = () => {
    if (task.completedAt) return; // Don't allow editing completed tasks
    setEditTitle(task.title);
    setIsInlineEditing(true);
  };

  const handleInlineEditSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle || trimmedTitle === task.title) {
      setIsInlineEditing(false);
      setEditTitle(task.title);
      return;
    }

    try {
      setIsSaving(true);
      await tasksApi.update(task.id, { title: trimmedTitle });
      setIsInlineEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update task:', error);
      setEditTitle(task.title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInlineEditCancel = () => {
    setIsInlineEditing(false);
    setEditTitle(task.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInlineEditSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleInlineEditCancel();
    }
  };

  const isTaskOverdue = task.dueDate && !task.completedAt && isOverdue(task.dueDate);

  return (
    <>
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-all duration-200 ${
          task.completedAt ? 'opacity-60' : ''
        } ${isCompleting ? 'scale-95 opacity-50' : ''}`}
      >
        <Checkbox
          checked={!!task.completedAt}
          onCheckedChange={handleToggleComplete}
          disabled={isCompleting}
          className="transition-transform duration-200"
        />
        <div className="flex-1 min-w-0">
          {isInlineEditing ? (
            <Input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInlineEditSave}
              disabled={isSaving}
              className="h-8 text-base"
              placeholder="Task title..."
            />
          ) : (
            <div
              className={`cursor-pointer transition-all duration-200 ${
                task.completedAt ? 'line-through text-muted-foreground' : 'hover:text-primary'
              }`}
              onClick={handleInlineEditStart}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleInlineEditStart()}
            >
              {task.title}
            </div>
          )}
          {task.description && !isInlineEditing && (
            <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
          )}
          {task.dueDate && !isInlineEditing && (
            <div className={`text-xs mt-1 ${isTaskOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              {formatTaskDueDate(task.dueDate)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.priority && !isInlineEditing && (
            <span className={`text-xs px-2 py-1 rounded ${
              task.priority === 'urgent' ? 'bg-destructive text-destructive-foreground' :
              task.priority === 'high' ? 'bg-orange-500 text-white' :
              task.priority === 'medium' ? 'bg-yellow-500 text-white' :
              'bg-muted text-muted-foreground'
            }`}>
              {task.priority}
            </span>
          )}
          {!isInlineEditing && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowEditForm(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {showEditForm && (
        <TaskForm
          task={task}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}

