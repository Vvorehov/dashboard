import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import KanbanColumn from './KanbanColumn.vue';

// Mock TaskItem component
vi.mock('./TaskItem.vue', () => ({
  default: {
    name: 'TaskItem',
    template: '<div class="mock-task-item" data-testid="task-item"><slot /></div>',
    props: ['task', 'projectId']
  }
}));

describe('KanbanColumn.vue', () => {
  // Test data
  const baseProps = {
    title: 'To Do',
    type: 'pending',
    tasks: [],
    projectId: 'project1',
    emptyText: 'pending'
  };

  const createWrapper = (props = {}) => {
    return mount(KanbanColumn, {
      props: { ...baseProps, ...props },
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });
  };

  it('renders the column title correctly', () => {
    const wrapper = createWrapper({ title: 'In Progress' });
    expect(wrapper.find('.column-header h3').text()).toBe('In Progress');
  });

  it('displays the correct task count', () => {
    const tasks = [
      { id: 'task1', title: 'Task 1', status: 'todo' },
      { id: 'task2', title: 'Task 2', status: 'todo' }
    ];
    const wrapper = createWrapper({ tasks });
    expect(wrapper.find('.task-count').text()).toBe('2');
  });

  it('applies the correct class based on the type prop', () => {
    const wrapper = createWrapper({ type: 'in-progress' });
    expect(wrapper.find('.column-header').classes()).toContain('in-progress');
  });

  it('shows empty state message when no tasks are provided', () => {
    const wrapper = createWrapper({ emptyText: 'pending' });
    expect(wrapper.find('.empty-column').exists()).toBe(true);
    expect(wrapper.find('.empty-column p').text()).toBe('No pending tasks');
  });

  it('renders the correct number of task items', () => {
    const tasks = [
      { id: 'task1', title: 'Task 1', status: 'todo' },
      { id: 'task2', title: 'Task 2', status: 'todo' },
      { id: 'task3', title: 'Task 3', status: 'todo' }
    ];
    const wrapper = createWrapper({ tasks });
    expect(wrapper.findAll('[data-testid="task-item"]').length).toBe(3);
  });

  it('forwards delete events from TaskItem', async () => {
    const task = { id: 'task1', title: 'Task 1', status: 'todo' };
    const tasks = [task];
    const wrapper = createWrapper({ tasks });
    
    // Find the TaskItem component and emit a delete event
    await wrapper.findComponent({ name: 'TaskItem' }).vm.$emit('delete', task);
    
    // Check if the KanbanColumn forwarded the event correctly
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')[0][0]).toEqual(task);
  });
}); 