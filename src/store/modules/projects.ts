import { Module, ActionContext } from 'vuex';
import { ProjectsState, Project, RootState } from '@/types';

const state: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null
};

const getters = {
  allProjects: (state: ProjectsState) => state.projects,
  currentProject: (state: ProjectsState) => state.currentProject,
  isLoading: (state: ProjectsState) => state.loading,
  error: (state: ProjectsState) => state.error
};

const actions = {
  async fetchProjects({ commit }: ActionContext<ProjectsState, RootState>) {
    commit('setLoading', true);
    try {
      const storedProjects = localStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];

      await new Promise(resolve => setTimeout(resolve, 300));

      commit('setProjects', projects);
      commit('setError', null);
    } catch (error) {
      commit('setError', 'Failed to fetch projects');
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  },

  async addProject({ commit, state }: ActionContext<ProjectsState, RootState>, project: Omit<Project, 'id' | 'tasks'>) {
    commit('setLoading', true);
    try {
      const id = Date.now().toString();
      const newProject: Project = { ...project, id, tasks: [] };
      await new Promise(resolve => setTimeout(resolve, 300));

      commit('addProject', newProject);
      localStorage.setItem('projects', JSON.stringify(state.projects));

      commit('setError', null);
      return newProject;
    } catch (error) {
      commit('setError', 'Failed to add project');
      console.error(error);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async updateProject({ commit, state }: ActionContext<ProjectsState, RootState>, updatedProject: Project) {
    commit('setLoading', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      commit('updateProject', updatedProject);

      localStorage.setItem('projects', JSON.stringify(state.projects));

      commit('setError', null);
    } catch (error) {
      commit('setError', 'Failed to update project');
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  },

  async optimisticDeleteProject({ commit, state }: ActionContext<ProjectsState, RootState>, projectId: string) {
    try {
      const backupProjects = [...state.projects];
      
      commit('deleteProject', projectId);
      
      localStorage.setItem('projects', JSON.stringify(state.projects));
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      commit('setError', null);
      return true;
    } catch (error) {
      commit('setError', 'Failed to delete project');
      console.error(error);
      return false;
    }
  },

  async deleteProject({ commit, state }: ActionContext<ProjectsState, RootState>, projectId: string) {
    commit('setLoading', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      commit('deleteProject', projectId);

      localStorage.setItem('projects', JSON.stringify(state.projects));

      commit('setError', null);
    } catch (error) {
      commit('setError', 'Failed to delete project');
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  },

  setCurrentProject({ commit }: ActionContext<ProjectsState, RootState>, project: Project | null) {
    commit('setCurrentProject', project);
  }
};

const mutations = {
  setProjects(state: ProjectsState, projects: Project[]) {
    state.projects = projects;
  },
  addProject(state: ProjectsState, project: Project) {
    state.projects.push(project);
  },
  updateProject(state: ProjectsState, updatedProject: Project) {
    const index = state.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      const tasks = state.projects[index].tasks || [];
      state.projects[index] = { ...updatedProject, tasks };

      if (state.currentProject && state.currentProject.id === updatedProject.id) {
        state.currentProject = { ...updatedProject, tasks };
      }
    }
  },
  deleteProject(state: ProjectsState, projectId: string) {
    state.projects = state.projects.filter(p => p.id !== projectId);

    if (state.currentProject && state.currentProject.id === projectId) {
      state.currentProject = null;
    }
  },
  setCurrentProject(state: ProjectsState, project: Project | null) {
    state.currentProject = project;
  },
  setLoading(state: ProjectsState, loading: boolean) {
    state.loading = loading;
  },
  setError(state: ProjectsState, error: string | null) {
    state.error = error;
  }
};

const projectsModule: Module<ProjectsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

export default projectsModule; 