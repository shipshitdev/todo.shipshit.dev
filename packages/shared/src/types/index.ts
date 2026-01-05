export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ViewMode {
  LIST = 'list',
  KANBAN = 'kanban',
  TIMELINE = 'timeline',
}

export enum ProjectStatus {
  IDEA = 'idea',
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  TESTING = 'testing',
  LAUNCHED = 'launched',
  DISTRIBUTED = 'distributed',
  PAUSED = 'paused',
  ABANDONED = 'abandoned',
}

export enum ProjectCategory {
  SIDE_PROJECT = 'side-project',
  MONEY_MAKER = 'money-maker',
  TOOL = 'tool',
  OSS = 'oss',
  FAMILY = 'family',
  EXPERIMENT = 'experiment',
  OTHER = 'other',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  goalId?: string;
  milestoneId?: string;
  dueDate?: Date | string;
  completedAt?: Date | string;
  priority: TaskPriority;
  labels?: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number; // 0-100 percentage
  startDate?: Date | string;
  targetLaunchDate?: Date | string;
  launchedAt?: Date | string;
  distributionChannels?: string[];
  tags?: string[];
  order: number;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  preferences?: UserPreferences;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserPreferences {
  defaultView?: ViewMode;
  theme?: 'light' | 'dark';
  defaultProjectId?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string;
  goalId?: string;
  milestoneId?: string;
  dueDate?: Date | string;
  priority?: TaskPriority;
  labels?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  projectId?: string;
  goalId?: string | null;
  milestoneId?: string | null;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
  priority?: TaskPriority;
  labels?: string[];
  order?: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  category?: ProjectCategory;
  startDate?: Date | string;
  targetLaunchDate?: Date | string;
  tags?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  category?: ProjectCategory;
  progress?: number;
  startDate?: Date | string | null;
  targetLaunchDate?: Date | string | null;
  launchedAt?: Date | string | null;
  distributionChannels?: string[];
  tags?: string[];
  order?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export type GoalCategory = 'business' | 'personal';

export interface Milestone {
  id: string;
  title: string;
  targetDate?: Date | string;
  completed: boolean;
  completedAt?: Date | string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetYear: number; // 2026-2036
  milestones: Milestone[];
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateGoalDto {
  title: string;
  description?: string;
  category: GoalCategory;
  targetYear: number;
  milestones?: Omit<Milestone, 'id'>[];
}

export interface UpdateGoalDto {
  title?: string;
  description?: string;
  category?: GoalCategory;
  targetYear?: number;
  milestones?: Milestone[];
}

