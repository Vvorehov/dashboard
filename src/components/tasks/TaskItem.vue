<template>
  <el-card class="task-item" :class="`priority-${task.priority}`">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <div class="task-actions">
        <el-button size="small" type="danger" circle @click="$emit('delete', task)">
          <el-icon><Delete /></el-icon>
        </el-button>
        <router-link :to="`/projects/${projectId}/tasks/${task.id}/edit`">
          <el-button size="small" type="primary" circle>
            <el-icon><Edit /></el-icon>
          </el-button>
        </router-link>
      </div>
    </div>

    <p v-if="truncatedDescription" class="task-description">
      {{ truncatedDescription }}
    </p>

    <div class="task-details">
      <div class="detail-item">
        <el-tag :type="priorityTagType" effect="light" size="small">
          {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
          Priority
        </el-tag>
      </div>

      <div v-if="task.dueDate" class="detail-item">
        <span class="detail-label">Due:</span>
        <span :class="{ overdue: isOverdue }">{{ formattedDueDate }}</span>
      </div>
    </div>

    <div class="task-status">
      <el-select
        v-model="currentStatus"
        placeholder="Status"
        size="small"
        @change="handleStatusChange"
      >
        <el-option
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>
  </el-card>
</template>

<script>
import { ref, computed, watchEffect } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';

export default {
  name: 'TaskItem',
  components: {
    Edit,
    Delete
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  emits: ['status-change', 'delete'],
  setup(props, { emit }) {
    // Status options
    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in-progress' },
      { label: 'Completed', value: 'completed' }
    ];

    const currentStatus = ref(props.task.status);

    watchEffect(() => {
      currentStatus.value = props.task.status;
    });

    const handleStatusChange = newStatus => {
      emit('status-change', props.task.id, newStatus);
    };

    const priorityTagType = computed(() => {
      switch (props.task.priority) {
        case 'high':
          return 'danger';
        case 'medium':
          return 'warning';
        case 'low':
          return 'success';
        default:
          return 'info';
      }
    });

    const truncatedDescription = computed(() => {
      if (!props.task.description) return '';

      return props.task.description.length > 60
        ? props.task.description.substring(0, 60) + '...'
        : props.task.description;
    });

    const formattedDueDate = computed(() => {
      if (!props.task.dueDate) return '';
      console.log('due date', props.task.dueDate);
      const date = new Date(props.task.dueDate);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    });

    const isOverdue = computed(() => {
      if (!props.task.dueDate || props.task.status === 'completed') return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueDate = new Date(props.task.dueDate);
      return dueDate < today;
    });

    return {
      statusOptions,
      currentStatus,
      handleStatusChange,
      priorityTagType,
      formattedDueDate,
      isOverdue,
      truncatedDescription
    };
  }
};
</script>

<style scoped>
.task-item {
  position: relative;
  border-radius: 4px;
  border-left-width: 4px;
  transition: all 0.3s ease; /* Smooth transition for status changes */
}

.priority-high {
  border-left-color: #f56c6c;
}

.priority-medium {
  border-left-color: #e6a23c;
}

.priority-low {
  border-left-color: #67c23a;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.task-title {
  margin: 0;
  font-size: 1.1rem;
  color: #303133;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-description {
  margin-bottom: 15px;
  color: #606266;
  white-space: pre-line;
  word-break: break-word;
}

.task-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  color: #909399;
  margin-right: 5px;
}

.task-status {
  margin-top: 10px;
  transition: opacity 0.2s ease;
}

.overdue {
  color: #f56c6c;
  font-weight: bold;
}
</style>
