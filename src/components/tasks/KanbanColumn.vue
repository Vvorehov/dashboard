<template>
  <div class="kanban-column">
    <div class="column-header" :class="type">
      <h3>{{ title }}</h3>
      <span class="task-count">{{ tasks.length }}</span>
    </div>
    <div class="column-content">
      <div v-if="tasks.length === 0" class="empty-column">
        <p>No {{ emptyText }} tasks</p>
      </div>
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :project-id="projectId"
        @status-change="handleStatusChange"
        @delete="$emit('delete', $event)"
        class="task-card"
      />
    </div>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue';

export default {
  name: 'KanbanColumn',
  components: {
    TaskItem
  },
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => ['pending', 'in-progress', 'completed', 'all'].includes(value)
    },
    tasks: {
      type: Array,
      default: () => []
    },
    projectId: {
      type: String,
      required: true
    },
    emptyText: {
      type: String,
      default: ''
    }
  },
  emits: ['status-change', 'delete'],
  setup(props, { emit }) {
    const handleStatusChange = (taskId, newStatus) => {
      console.log('KanbanColumn - forwarding status change:', taskId, newStatus);
      console.log('Column type:', props.type, 'Project ID:', props.projectId);
      emit('status-change', taskId, newStatus);
    };
    
    return {
      handleStatusChange
    };
  }
};
</script>

<style scoped>
.kanban-column {
  flex: 1;
  min-width: 300px;
  background-color: #f5f7fa;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  min-height: 400px;
  transition: all 0.2s ease;
  position: relative;
}

.column-header {
  padding: 12px 15px;
  border-radius: 5px 5px 0 0;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.column-header.pending {
  background-color: #e6f1f9;
  color: #1989fa;
}

.column-header.in-progress {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.column-header.completed {
  background-color: #f0f9eb;
  color: #67c23a;
}

.column-header.all {
  background-color: #f2f6fc;
  color: #909399;
}

.task-count {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.column-content {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 300px;
  position: relative;
}

.empty-column {
  text-align: center;
  padding: 20px 0;
  color: #909399;
  font-style: italic;
}

.task-card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}
</style>
