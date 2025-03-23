// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string | null;
  createdAt: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

// Store state types
export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  loading: boolean;
  error: string | null;
}

export interface RootState {
  projects: ProjectsState;
  tasks: TasksState;
} 