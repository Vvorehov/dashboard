import { Module, ActionContext } from 'vuex';
import { TasksState, Task, RootState, Project } from '@/types';

// Tasks module for Vuex store
const state: TasksState = {
  loading: false,
  error: null
};

const getters = {
  isLoading: (state: TasksState) => state.loading,
  error: (state: TasksState) => state.error,
  getTasksByProject: (state: TasksState, getters: any, rootState: RootState) => (projectId: string) => {
    const project = rootState.projects.projects.find(p => p.id === projectId);
    return project ? project.tasks || [] : [];
  },
  getTaskById: (state: TasksState, getters: any) => (projectId: string, taskId: string) => {
    const tasks = getters.getTasksByProject(projectId);
    return tasks.find((t: Task) => t.id === taskId);
  }
};

interface AddTaskPayload {
  projectId: string;
  task: Omit<Task, 'id'>;
}

interface UpdateTaskPayload {
  projectId: string;
  task: Task;
}

interface DeleteTaskPayload {
  projectId: string;
  taskId: string;
}

const actions = {
  async addTask(
    { commit, rootState }: ActionContext<TasksState, RootState>, 
    { projectId, task }: AddTaskPayload
  ) {
    commit('setLoading', true);
    try {
      const id = Date.now().toString();
      const newTask: Task = { ...task, id };
      await new Promise(resolve => setTimeout(resolve, 300));
      commit('addTask', { projectId, task: newTask });
      localStorage.setItem('projects', JSON.stringify(rootState.projects.projects));

      commit('setError', null);
      return newTask;
    } catch (error) {
      commit('setError', 'Failed to add task');
      console.error(error);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async updateTask(
    { commit, rootState }: ActionContext<TasksState, RootState>, 
    { projectId, task }: UpdateTaskPayload
  ) {
    commit('setLoading', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      commit('updateTask', { projectId, task });
      localStorage.setItem('projects', JSON.stringify(rootState.projects.projects));
      commit('setError', null);
    } catch (error) {
      commit('setError', 'Failed to update task');
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  },

  async deleteTask(
    { commit, rootState }: ActionContext<TasksState, RootState>, 
    { projectId, taskId }: DeleteTaskPayload
  ) {
    commit('setLoading', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      commit('deleteTask', { projectId, taskId });
      localStorage.setItem('projects', JSON.stringify(rootState.projects.projects));
      commit('setError', null);
    } catch (error) {
      commit('setError', 'Failed to delete task');
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  }
};

// Explicitly type the store instance to avoid this errors
interface StoreInstance {
  state: {
    projects: {
      projects: Project[];
      currentProject: Project | null;
    }
  }
}

const mutations = {
  addTask(state: TasksState, { projectId, task }: { projectId: string; task: Task }) {
    const store = this as unknown as StoreInstance;
    if (store.state.projects.projects) {
      const project = store.state.projects.projects.find(p => p.id === projectId);
      if (project) {
        if (!project.tasks) {
          project.tasks = [];
        }
        project.tasks.push(task);

        if (
          store.state.projects.currentProject &&
          store.state.projects.currentProject.id === projectId
        ) {
          if (!store.state.projects.currentProject.tasks) {
            store.state.projects.currentProject.tasks = [];
          }
          store.state.projects.currentProject.tasks.push(task);
        }
      }
    }
  },

  updateTask(state: TasksState, { projectId, task }: { projectId: string; task: Task }) {
    const store = this as unknown as StoreInstance;
    if (store.state.projects.projects) {
      const project = store.state.projects.projects.find(p => p.id === projectId);
      if (project && project.tasks) {
        const index = project.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          project.tasks[index] = task;

          if (
            store.state.projects.currentProject &&
            store.state.projects.currentProject.id === projectId
          ) {
            const currentIndex = store.state.projects.currentProject.tasks.findIndex(
              t => t.id === task.id
            );
            if (currentIndex !== -1) {
              store.state.projects.currentProject.tasks[currentIndex] = task;
            }
          }
        }
      }
    }
  },

  deleteTask(state: TasksState, { projectId, taskId }: { projectId: string; taskId: string }) {
    const store = this as unknown as StoreInstance;
    if (store.state.projects.projects) {
      const project = store.state.projects.projects.find(p => p.id === projectId);
      if (project && project.tasks) {
        project.tasks = project.tasks.filter(t => t.id !== taskId);
        if (
          store.state.projects.currentProject &&
          store.state.projects.currentProject.id === projectId
        ) {
          store.state.projects.currentProject.tasks =
            store.state.projects.currentProject.tasks.filter(t => t.id !== taskId);
        }
      }
    }
  },

  setLoading(state: TasksState, loading: boolean) {
    state.loading = loading;
  },

  setError(state: TasksState, error: string | null) {
    state.error = error;
  }
};

const tasksModule: Module<TasksState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

export default tasksModule; 