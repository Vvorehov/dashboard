import { describe, it, expect, vi, beforeEach } from 'vitest';
import projectsModule from './projects';

// Mock localStorage
const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn()
};

global.localStorage = localStorageMock;

describe('Projects Vuex Module', () => {
  let state;
  let commit;

  beforeEach(() => {
    // Reset state before each test
    state = {
      projects: [],
      currentProject: null,
      loading: false,
      error: null
    };

    // Mock commit function
    commit = vi.fn();
    
    // Clear localStorage mock calls
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
  });

  describe('getters', () => {
    it('allProjects returns all projects from state', () => {
      state.projects = [{ id: '1', name: 'Project 1' }, { id: '2', name: 'Project 2' }];
      expect(projectsModule.getters.allProjects(state)).toEqual([
        { id: '1', name: 'Project 1' }, 
        { id: '2', name: 'Project 2' }
      ]);
    });

    it('currentProject returns the current project', () => {
      state.currentProject = { id: '1', name: 'Project 1' };
      expect(projectsModule.getters.currentProject(state)).toEqual({ id: '1', name: 'Project 1' });
    });

    it('isLoading returns the loading state', () => {
      state.loading = true;
      expect(projectsModule.getters.isLoading(state)).toBe(true);
    });

    it('error returns the error state', () => {
      state.error = 'Test error';
      expect(projectsModule.getters.error(state)).toBe('Test error');
    });
  });

  describe('mutations', () => {
    it('setProjects updates the projects array', () => {
      const projects = [{ id: '1', name: 'Project 1' }];
      projectsModule.mutations.setProjects(state, projects);
      expect(state.projects).toEqual(projects);
    });

    it('addProject adds a project to the array', () => {
      const project = { id: '1', name: 'New Project' };
      projectsModule.mutations.addProject(state, project);
      expect(state.projects).toContain(project);
    });

    it('deleteProject removes a project from the array', () => {
      state.projects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' }
      ];
      
      projectsModule.mutations.deleteProject(state, '1');
      expect(state.projects.length).toBe(1);
      expect(state.projects[0].id).toBe('2');
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('fetchProjects retrieves projects from localStorage', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProjects));
      
      const action = projectsModule.actions.fetchProjects({ commit });
      
      vi.runAllTimers();
      await action;
      
      expect(commit).toHaveBeenCalledWith('setLoading', true);
      expect(commit).toHaveBeenCalledWith('setProjects', mockProjects);
      expect(commit).toHaveBeenCalledWith('setError', null);
      expect(commit).toHaveBeenCalledWith('setLoading', false);
    });

    it('addProject creates and stores a new project', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(12345);
      
      const projectData = { name: 'New Project', description: 'Test description' };
      const expectedProject = { ...projectData, id: '12345', tasks: [] };
      
      const action = projectsModule.actions.addProject({ commit, state }, projectData);
      
      vi.runAllTimers();
      await action;
      
      expect(commit).toHaveBeenCalledWith('setLoading', true);
      expect(commit).toHaveBeenCalledWith('addProject', expectedProject);
      expect(commit).toHaveBeenCalledWith('setError', null);
      expect(commit).toHaveBeenCalledWith('setLoading', false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('projects', JSON.stringify([]));
    });
  });
}); 