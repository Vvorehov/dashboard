<template>
  <div class="proj-detail">
    <!-- Project header -->
    <div v-if="project" class="proj-header">
      <div class="title-wrapper">
        <h1 class="proj-title">{{ project.name }}</h1>
        <div class="actions">
          <router-link :to="`/projects/${project.id}/edit`">
            <el-button type="primary" size="small">
              <el-icon><Edit /></el-icon>
              Edit Project
            </el-button>
          </router-link>
          <el-button type="danger" size="small" @click="confirmDeleteProject">
            <el-icon><Delete /></el-icon>
            Delete Project
          </el-button>
        </div>
      </div>

      <p class="proj-description">{{ project.description }}</p>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="isLoading" class="proj-header">
      <div class="title-wrapper">
        <el-skeleton-item variant="h1" style="width: 50%; height: 32px;" />
        <div class="actions" style="display: flex; gap: 10px;">
          <el-skeleton-item variant="button" style="width: 100px; height: 32px;" />
          <el-skeleton-item variant="button" style="width: 120px; height: 32px;" />
        </div>
      </div>
      <el-skeleton-item variant="p" style="width: 100%; height: 60px; margin-top: 15px;" />
    </div>

    <!-- Not found state -->
    <el-empty v-else-if="!isLoading" description="Project not found">
      <router-link to="/">
        <el-button type="primary">Back to Projects</el-button>
      </router-link>
    </el-empty>

    <!-- Task management section -->
    <div v-if="project" class="task-section">
      <!-- Task header -->
      <el-row class="task-header" :gutter="10">
        <el-col :xs="18" :sm="20">
          <div class="header-content">
            <h2 class="section-title">Tasks</h2>
            <div v-if="isFilterActive" class="filter-indicator">
              <el-tag size="small" type="info">
                Filtered
                <el-button type="text" size="small" class="clear-btn" @click="clearAllFilters">
                  <el-icon><Close /></el-icon>
                </el-button>
              </el-tag>
            </div>
          </div>
        </el-col>
        <el-col :xs="6" :sm="4" style="text-align: right">
          <router-link :to="`/projects/${project.id}/tasks/new`">
            <el-button type="success" size="small">
              <el-icon><Plus /></el-icon>
              Add
            </el-button>
          </router-link>
        </el-col>
      </el-row>

      <!-- Task filters -->
      <el-row class="filters" :gutter="10">
        <el-col :span="12">
          <el-select
            v-model="filters.priority"
            placeholder="Filter by Priority"
            clearable
            class="filter-select"
            style="width: 100%"
            @clear="handlePriorityClear"
          >
            <el-option
              v-for="option in priorityOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-col>

        <el-col :span="12">
          <el-select
            v-model="sortBy"
            placeholder="Sort By"
            class="filter-select"
            style="width: 100%"
          >
            <el-option
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <!-- Empty tasks state -->
      <el-empty v-if="!isLoading && tasks.length === 0" description="No tasks found">
        <router-link :to="`/projects/${project.id}/tasks/new`">
          <el-button type="primary">Create New Task</el-button>
        </router-link>
      </el-empty>

      <!-- List view (shows all tasks) -->
      <div v-else-if="viewMode === 'list'" class="list-view">
        <el-table :data="filteredTasks" style="width: 100%">
          <el-table-column prop="title" label="Title" />
          <el-table-column label="Status">
            <template #default="{ row }">
              <el-tag 
                :type="row.status === 'completed' ? 'success' : row.status === 'in-progress' ? 'warning' : 'info'"
              >
                {{ row.status === 'pending' ? 'Pending' : 
                   row.status === 'in-progress' ? 'In Progress' : 'Completed' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Priority">
            <template #default="{ row }">
              <el-tag 
                :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'success'"
                effect="light"
              >
                {{ row.priority.charAt(0).toUpperCase() + row.priority.slice(1) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Due Date">
            <template #default="{ row }">
              <span v-if="row.dueDate" :class="{ 'overdue': isTaskOverdue(row) }">
                {{ formatDueDate(row.dueDate) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="150">
            <template #default="{ row }">
              <el-button-group>
                <router-link :to="`/projects/${project.id}/tasks/${row.id}/edit`">
                  <el-button size="small" type="primary">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </router-link>
                <el-button size="small" type="danger" @click="confirmDeleteTask(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Kanban board layout -->
      <div v-else class="kanban-board">
        <kanban-column
          title="Pending"
          type="pending"
          :tasks="pendingTasks"
          :project-id="project.id"
          empty-text="pending"
          @status-change="updateTaskStatus"
          @delete="confirmDeleteTask"
        />

        <kanban-column
          title="In Progress"
          type="in-progress"
          :tasks="inProgressTasks"
          :project-id="project.id"
          empty-text="in progress"
          @status-change="updateTaskStatus"
          @delete="confirmDeleteTask"
        />

        <kanban-column
          title="Completed"
          type="completed"
          :tasks="completedTasks"
          :project-id="project.id"
          empty-text="completed"
          @status-change="updateTaskStatus"
          @delete="confirmDeleteTask"
        />
      </div>
    </div>
    
    <!-- Skeleton loader for tasks -->
    <div v-else-if="isLoading" class="task-section">
      <el-row class="task-header" :gutter="10">
        <el-col :xs="18" :sm="20">
          <el-skeleton-item variant="h3" style="width: 30%; height: 24px;" />
        </el-col>
        <el-col :xs="6" :sm="4" style="text-align: right">
          <el-skeleton-item variant="button" style="width: 80px; height: 32px;" />
        </el-col>
      </el-row>
      
      <el-row class="filters" :gutter="10">
        <el-col :span="12">
          <el-skeleton-item variant="text" style="width: 100%; height: 40px;" />
        </el-col>
        <el-col :span="12">
          <el-skeleton-item variant="text" style="width: 100%; height: 40px;" />
        </el-col>
      </el-row>
      
      <div class="kanban-board">
        <div v-for="i in 3" :key="i" class="kanban-column-skeleton">
          <div class="column-header-skeleton">
            <el-skeleton-item variant="text" style="width: 60%; height: 24px;" />
          </div>
          <div class="column-content-skeleton">
            <div v-for="j in 2" :key="j" class="task-skeleton">
              <el-skeleton-item variant="text" style="width: 90%; height: 22px; margin-bottom: 10px;" />
              <el-skeleton-item variant="p" style="width: 100%; height: 40px; margin-bottom: 10px;" />
              <div style="display: flex; justify-content: space-between;">
                <el-skeleton-item variant="text" style="width: 40%; height: 20px;" />
                <el-skeleton-item variant="text" style="width: 40%; height: 20px;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
import { Edit, Delete, Plus, Close } from '@element-plus/icons-vue';
import KanbanColumn from '../components/tasks/KanbanColumn.vue';

export default {
  name: 'ProjectDetail',
  components: {
    KanbanColumn,
    Edit,
    Delete,
    Plus,
    Close
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    // Local storage keys
    const STORAGE_KEYS = {
      PRIORITY_FILTER: `project_${props.id}_priority_filter`,
      SORT_BY: `project_${props.id}_sort_by`
    };

    const STATUS = {
      PENDING: 'pending',
      IN_PROGRESS: 'in-progress',
      COMPLETED: 'completed'
    };

    // Status options for filtering
    const statusOptions = [
      { label: 'All', value: 'all' },
      { label: 'Pending', value: STATUS.PENDING },
      { label: 'In Progress', value: STATUS.IN_PROGRESS },
      { label: 'Completed', value: STATUS.COMPLETED }
    ];

    const priorityOptions = [
      { label: 'All', value: 'all' },
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' }
    ];

    const sortOptions = [
      { label: 'Due Date (Ascending)', value: 'dueDate-asc' },
      { label: 'Due Date (Descending)', value: 'dueDate-desc' },
      { label: 'Priority (Highest first)', value: 'priority-desc' },
      { label: 'Priority (Lowest first)', value: 'priority-asc' },
      { label: 'Title (A-Z)', value: 'title-asc' },
      { label: 'Title (Z-A)', value: 'title-desc' }
    ];

    const loadFromStorage = (key, defaultValue) => {
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
      } catch (err) {
        console.error('Error loading from localStorage:', err);
        return defaultValue;
      }
    };

    const saveToStorage = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    };

    const filters = reactive({
      priority: loadFromStorage(STORAGE_KEYS.PRIORITY_FILTER, 'all'),
      status: loadFromStorage(`project_${props.id}_status_filter`, 'all')
    });

    const sortBy = ref(loadFromStorage(STORAGE_KEYS.SORT_BY, 'dueDate-asc'));

    const viewMode = ref('kanban');

    watch(
      () => filters.priority,
      newValue => {
        saveToStorage(STORAGE_KEYS.PRIORITY_FILTER, newValue);
      }
    );

    watch(
      () => filters.status,
      newValue => {
        saveToStorage(`project_${props.id}_status_filter`, newValue);
      }
    );

    watch(sortBy, newValue => {
      saveToStorage(STORAGE_KEYS.SORT_BY, newValue);
    });

    const isLoading = computed(() => store.getters['projects/isLoading']);
    const projects = computed(() => store.getters['projects/allProjects']);
    const project = computed(() => {
      return projects.value.find(p => p.id === props.id) || null;
    });

    const tasks = computed(() => {
      return project.value && project.value.tasks ? project.value.tasks : [];
    });

    const filteredTasks = computed(() => {
      let result = tasks.value.filter(task => {
        // Apply priority filter
        if (!filters.priority || filters.priority === 'all') {
          // Priority filter is 'all', no filtering by priority
        } else if (task.priority !== filters.priority) {
          return false;
        }

        // Apply status filter
        if (!filters.status || filters.status === 'all') {
          // Status filter is 'all', no filtering by status
        } else if (task.status !== filters.status) {
          return false;
        }

        return true;
      });

      if (sortBy.value) {
        const [field, direction] = sortBy.value.split('-');

        result = [...result].sort((a, b) => {
          if (field === 'dueDate') {
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
            return direction === 'asc' ? dateA - dateB : dateB - dateA;
          }

          if (field === 'priority') {
            const priorityMap = { low: 1, medium: 2, high: 3 };
            const priorityA = priorityMap[a.priority] || 0;
            const priorityB = priorityMap[b.priority] || 0;
            return direction === 'asc' ? priorityA - priorityB : priorityB - priorityA;
          }

          if (field === 'title') {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return direction === 'asc'
              ? titleA.localeCompare(titleB)
              : titleB.localeCompare(titleA);
          }

          return 0;
        });
      }

      return result;
    });

    const pendingTasks = computed(() => {
      return filteredTasks.value.filter(task => task.status === STATUS.PENDING);
    });

    const inProgressTasks = computed(() => {
      return filteredTasks.value.filter(task => task.status === STATUS.IN_PROGRESS);
    });

    const completedTasks = computed(() => {
      return filteredTasks.value.filter(task => task.status === STATUS.COMPLETED);
    });

    onMounted(() => {
      getProjects();
    });

    function getProjects() {
      store.dispatch('projects/fetchProjects');
    }

    watch(project, newProject => {
      if (!newProject && !isLoading.value && projects.value.length > 0) {
        router.push({ name: 'Home' });
      }
    });

    const updateTaskStatus = (taskId, newStatus) => {
      if (!project.value) return;

      const task = project.value.tasks.find(t => t.id === taskId);
      if (task) {
        console.log('Updating task status from', task.status, 'to', newStatus);
        
        // Create an updated task with the new status
        const updatedTask = { ...task, status: newStatus };
        
        // Optimistically update the task locally to avoid UI jumps
        // This creates a smoother user experience
        const taskIndex = project.value.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          project.value.tasks.splice(taskIndex, 1, updatedTask);
        }
        
        // Then dispatch the special status update action that doesn't trigger loading state
        store.dispatch('tasks/updateTaskStatus', {
          projectId: project.value.id,
          taskId: taskId,
          newStatus: newStatus
        }).catch(error => {
          // If there's an error, revert the optimistic update
          console.error('Failed to update task status:', error);
          if (taskIndex !== -1) {
            project.value.tasks.splice(taskIndex, 1, task);
          }
        });
      }
    };

    const confirmDeleteTask = task => {
      ElMessageBox.confirm(`Are you sure you want to delete task "${task.title}"?`, 'Warning', {
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          store.dispatch('tasks/deleteTask', {
            projectId: project.value.id,
            taskId: task.id
          });
        })
        .catch(() => {
          // cancelled - do nothing
        });
    };

    const confirmDeleteProject = () => {
      if (!project.value) return;

      ElMessageBox.confirm(
        `Are you sure you want to delete project "${project.value.name}"? All associated tasks will also be deleted.`,
        'Warning',
        {
          confirmButtonText: 'Yes, Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          store.dispatch('projects/deleteProject', project.value.id).then(() => {
            router.push({ name: 'Home' });
          });
        })
        .catch(() => {});
    };

    const handlePriorityClear = () => {
      filters.priority = 'all';
    };

    const handleStatusClear = () => {
      filters.status = 'all';
    };

    const isFilterActive = computed(() => {
      return filters.priority !== 'all' || sortBy.value !== 'dueDate-asc';
    });

    const clearAllFilters = () => {
      filters.priority = 'all';
      filters.status = 'all';
      sortBy.value = 'dueDate-asc';
    };

    const isTaskOverdue = (task) => {
      if (!task.dueDate || task.status === 'completed') return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    };

    const formatDueDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return {
      project,
      tasks,
      filteredTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      isLoading,
      statusOptions,
      priorityOptions,
      sortOptions,
      filters,
      sortBy,
      viewMode,
      isFilterActive,
      updateTaskStatus,
      confirmDeleteTask,
      confirmDeleteProject,
      handlePriorityClear,
      handleStatusClear,
      clearAllFilters,
      isTaskOverdue,
      formatDueDate
    };
  }
};
</script>

<style scoped>
.proj-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.proj-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.proj-title {
  font-size: 1.8rem;
  margin: 0;
  color: #303133;
}

.actions {
  display: flex;
  gap: 10px;
}

.proj-description {
  margin: 10px 0 0;
  color: #606266;
  white-space: pre-line;
}

.task-section {
  margin-top: 15px;
}

.task-header {
  margin-bottom: 15px;
  align-items: center;
}

.section-title {
  font-size: 1.5rem;
  margin: 0;
  color: #303133;
  line-height: 1.2;
}

.filters {
  margin-bottom: 20px;
}

.filter-select {
  width: 100%;
}

/* Kanban board styles */
.kanban-board {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 10px; /* Space for scrollbar */
  min-height: 400px; /* Minimum height to prevent jumping */
  align-items: stretch;
}

.kanban-board > * {
  flex: 1;
  min-width: 300px;
}

.el-icon {
  margin-right: 5px;
}

/* media breakpoint - need to handle better on mobile */
@media (max-width: 768px) {
  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .filters {
    margin-bottom: 15px;
  }

  .filter-select {
    width: 100%;
  }

  .kanban-board {
    flex-direction: column;
    gap: 30px;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-indicator {
  margin-left: 10px;
}

.clear-btn {
  margin-left: 5px;
  padding: 0;
  color: #909399;
}

.view-toggle {
  width: 100%;
  display: flex;
}

.view-toggle .el-radio-button {
  flex: 1;
}

.list-view {
  margin-top: 20px;
}

.overdue {
  color: #f56c6c;
  font-weight: bold;
}

/* Skeleton loaders */
.kanban-column-skeleton {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.column-header-skeleton {
  padding: 12px 15px;
  border-radius: 5px 5px 0 0;
  background-color: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.column-content-skeleton {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-skeleton {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 15px;
  min-height: 100px;
}
</style>
