import { describe, it, expect, vi, beforeEach } from 'vitest';
import tasksModule from './tasks';

// Mock localStorage
const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn()
};

global.localStorage = localStorageMock;

describe('Tasks Vuex Module', () => {
  let state;
  let mockRootState;
  let commit;

  beforeEach(() => {
    // Reset state before each test
    state = {
      loading: false,
      error: null
    };

    // Mock rootState with projects data
    mockRootState = {
      projects: {
        projects: [
          {
            id: 'project1',
            tasks: [
              { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
            ]
          }
        ],
        currentProject: {
          id: 'project1',
          tasks: [
            { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
          ]
        }
      }
    };

    // Mock commit function
    commit = vi.fn();
    
    // Clear localStorage mock calls
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
  });

  describe('getters', () => {
    it('isLoading returns the loading state', () => {
      state.loading = true;
      expect(tasksModule.getters.isLoading(state)).toBe(true);
      
      state.loading = false;
      expect(tasksModule.getters.isLoading(state)).toBe(false);
    });

    it('error returns the error state', () => {
      state.error = 'Test error';
      expect(tasksModule.getters.error(state)).toBe('Test error');
      
      state.error = null;
      expect(tasksModule.getters.error(state)).toBe(null);
    });

    it('getTasksByProject returns tasks for the specified project', () => {
      const getter = tasksModule.getters.getTasksByProject(state, null, mockRootState);
      expect(getter('project1')).toEqual([
        { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
      ]);
      // Project that doesn't exist
      expect(getter('nonexistent')).toEqual([]);
    });

    it('getTaskById returns a specific task by id', () => {
      const getTasksByProject = vi.fn().mockReturnValue([
        { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
      ]);
      
      const getters = { getTasksByProject };
      const getter = tasksModule.getters.getTaskById(state, getters);
      
      expect(getter('project1', 'task1')).toEqual(
        { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
      );
      expect(getTasksByProject).toHaveBeenCalledWith('project1');
    });
    
    it('getTaskById returns undefined if task is not found', () => {
      const getTasksByProject = vi.fn().mockReturnValue([
        { id: 'task1', title: 'Task 1', status: 'todo', priority: 'medium' }
      ]);
      
      const getters = { getTasksByProject };
      const getter = tasksModule.getters.getTaskById(state, getters);
      
      expect(getter('project1', 'nonexistent')).toBeUndefined();
    });
  });

  describe('mutations', () => {
    it('setLoading updates the loading state', () => {
      tasksModule.mutations.setLoading(state, true);
      expect(state.loading).toBe(true);
      
      tasksModule.mutations.setLoading(state, false);
      expect(state.loading).toBe(false);
    });

    it('setError updates the error state', () => {
      tasksModule.mutations.setError(state, 'New error');
      expect(state.error).toBe('New error');
      
      tasksModule.mutations.setError(state, null);
      expect(state.error).toBe(null);
    });
    
    it('addTask adds a task to a project', () => {
      const mockState = {
        state: {
          projects: {
            projects: [{ id: 'project1', tasks: [] }],
            currentProject: { id: 'project1', tasks: [] }
          }
        }
      };
      
      const newTask = { id: 'task1', title: 'New Task' };
      
      tasksModule.mutations.addTask.call(mockState, state, { 
        projectId: 'project1', 
        task: newTask 
      });
      
      expect(mockState.state.projects.projects[0].tasks).toEqual([newTask]);
      expect(mockState.state.projects.currentProject.tasks).toEqual([newTask]);
    });
    
    it('updateTask modifies an existing task', () => {
      const mockState = {
        state: {
          projects: {
            projects: [{ 
              id: 'project1', 
              tasks: [{ id: 'task1', title: 'Task 1', completed: false }] 
            }],
            currentProject: { 
              id: 'project1', 
              tasks: [{ id: 'task1', title: 'Task 1', completed: false }] 
            }
          }
        }
      };
      
      const updatedTask = { id: 'task1', title: 'Updated Task', completed: true };
      
      tasksModule.mutations.updateTask.call(mockState, state, { 
        projectId: 'project1', 
        task: updatedTask 
      });
      
      expect(mockState.state.projects.projects[0].tasks[0]).toEqual(updatedTask);
      expect(mockState.state.projects.currentProject.tasks[0]).toEqual(updatedTask);
    });
    
    it('deleteTask removes a task from a project', () => {
      const mockState = {
        state: {
          projects: {
            projects: [{ 
              id: 'project1', 
              tasks: [
                { id: 'task1', title: 'Task 1' },
                { id: 'task2', title: 'Task 2' }
              ] 
            }],
            currentProject: { 
              id: 'project1', 
              tasks: [
                { id: 'task1', title: 'Task 1' },
                { id: 'task2', title: 'Task 2' }
              ]  
            }
          }
        }
      };
      
      tasksModule.mutations.deleteTask.call(mockState, state, { 
        projectId: 'project1', 
        taskId: 'task1' 
      });
      
      expect(mockState.state.projects.projects[0].tasks).toEqual([
        { id: 'task2', title: 'Task 2' }
      ]);
      expect(mockState.state.projects.currentProject.tasks).toEqual([
        { id: 'task2', title: 'Task 2' }
      ]);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      // Mock timer functions
      vi.useFakeTimers();
    });

    afterEach(() => {
      // Restore timer functions
      vi.useRealTimers();
    });
    
    it('addTask commits the correct mutations and returns the new task', async () => {
      // Mock Date.now to return a consistent ID
      const mockDateNow = vi.spyOn(Date, 'now').mockReturnValue(12345);
      
      const task = { title: 'New Task', status: 'todo', priority: 'high' };
      const expectedTask = { ...task, id: '12345' };
      
      const action = tasksModule.actions.addTask(
        { commit, rootState: mockRootState },
        { projectId: 'project1', task }
      );
      
      // Fast-forward timers
      vi.runAllTimers();
      
      const result = await action;
      
      expect(commit).toHaveBeenCalledWith('setLoading', true);
      expect(commit).toHaveBeenCalledWith('addTask', { 
        projectId: 'project1', 
        task: expectedTask 
      });
      expect(commit).toHaveBeenCalledWith('setError', null);
      expect(commit).toHaveBeenCalledWith('setLoading', false);
      expect(result).toEqual(expectedTask);
      
      // Clean up
      mockDateNow.mockRestore();
    });
    
    it('addTask handles errors appropriately', async () => {
      // Add longer timeout for this test
      vi.useFakeTimers();
      
      // Mock commit to throw an error when adding a task
      const errorCommit = vi.fn().mockImplementation((mutation, payload) => {
        if (mutation === 'addTask') {
          throw new Error('Failed to add task');
        }
      });
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const task = { title: 'Error Task' };
      
      // Instead of awaiting the action, we'll test the specific parts of it
      const action = tasksModule.actions.addTask(
        { commit: errorCommit, rootState: mockRootState },
        { projectId: 'project1', task }
      );
      
      // Fast-forward timers to handle the Promise.resolve in the action
      vi.runAllTimers();
      
      try {
        await action;
      } catch (error) {
        // Expected to throw, that's fine
      }
      
      expect(errorCommit).toHaveBeenCalledWith('setLoading', true);
      expect(errorCommit).toHaveBeenCalledWith('setError', 'Failed to add task');
      expect(errorCommit).toHaveBeenCalledWith('setLoading', false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
    
    it('updateTask commits the correct mutations', async () => {
      const task = { id: 'task1', title: 'Updated Task', status: 'done' };
      
      const action = tasksModule.actions.updateTask(
        { commit, rootState: mockRootState },
        { projectId: 'project1', task }
      );
      
      // Fast-forward timers
      vi.runAllTimers();
      
      await action;
      
      expect(commit).toHaveBeenCalledWith('setLoading', true);
      expect(commit).toHaveBeenCalledWith('updateTask', { 
        projectId: 'project1', 
        task 
      });
      expect(commit).toHaveBeenCalledWith('setError', null);
      expect(commit).toHaveBeenCalledWith('setLoading', false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('updateTask handles errors appropriately', async () => {
      // Mock commit to throw an error when updating a task
      const errorCommit = vi.fn().mockImplementation((mutation, payload) => {
        if (mutation === 'updateTask') {
          throw new Error('Failed to update task');
        }
      });
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const task = { id: 'task1', title: 'Error Task' };
      
      // Fast-forward timers
      const action = tasksModule.actions.updateTask(
        { commit: errorCommit, rootState: mockRootState },
        { projectId: 'project1', task }
      );
      
      vi.runAllTimers();
      await action;
      
      expect(errorCommit).toHaveBeenCalledWith('setLoading', true);
      expect(errorCommit).toHaveBeenCalledWith('setError', 'Failed to update task');
      expect(errorCommit).toHaveBeenCalledWith('setLoading', false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
    
    it('deleteTask commits the correct mutations', async () => {
      const action = tasksModule.actions.deleteTask(
        { commit, rootState: mockRootState },
        { projectId: 'project1', taskId: 'task1' }
      );
      
      // Fast-forward timers
      vi.runAllTimers();
      
      await action;
      
      expect(commit).toHaveBeenCalledWith('setLoading', true);
      expect(commit).toHaveBeenCalledWith('deleteTask', { 
        projectId: 'project1', 
        taskId: 'task1' 
      });
      expect(commit).toHaveBeenCalledWith('setError', null);
      expect(commit).toHaveBeenCalledWith('setLoading', false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('deleteTask handles errors appropriately', async () => {
      // Mock commit to throw an error when deleting a task
      const errorCommit = vi.fn().mockImplementation((mutation, payload) => {
        if (mutation === 'deleteTask') {
          throw new Error('Failed to delete task');
        }
      });
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Fast-forward timers
      const action = tasksModule.actions.deleteTask(
        { commit: errorCommit, rootState: mockRootState },
        { projectId: 'project1', taskId: 'task1' }
      );
      
      vi.runAllTimers();
      await action;
      
      expect(errorCommit).toHaveBeenCalledWith('setLoading', true);
      expect(errorCommit).toHaveBeenCalledWith('setError', 'Failed to delete task');
      expect(errorCommit).toHaveBeenCalledWith('setLoading', false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
}); 