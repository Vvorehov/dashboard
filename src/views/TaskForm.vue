<template>
  <div class="task-form">
    <el-row>
      <el-col :span="24">
        <h1 class="page-title">{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h1>
        <p v-if="project" class="proj-info">
          For project:
          <router-link :to="`/projects/${projectId}`">{{ project.name }}</router-link>
        </p>
      </el-col>
    </el-row>

    <el-row v-if="project">
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <el-form
          :model="formData"
          :rules="rules"
          ref="taskForm"
          label-position="top"
          @submit.prevent="submitForm"
        >
          <el-form-item label="Task Title" prop="title">
            <el-input
              v-model="formData.title"
              placeholder="Enter task title"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="Enter task description"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Priority" prop="priority">
            <el-select
              v-model="formData.priority"
              placeholder="Select priority"
              style="width: 100%"
            >
              <el-option
                v-for="option in priorityOpts"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Status" prop="status">
            <el-select v-model="formData.status" placeholder="Select status" style="width: 100%">
              <el-option
                v-for="option in statusOpts"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Due Date" prop="dueDate">
            <el-date-picker
              v-model="formData.dueDate"
              type="date"
              placeholder="Select due date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="isSubmitting">
              {{ isEditing ? 'Update Task' : 'Create Task' }}
            </el-button>
            <el-button @click="goBack" plain>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- Project not found state -->
    <el-empty v-else-if="!isLoading" description="Project not found">
      <router-link to="/">
        <el-button type="primary">Back to Projects</el-button>
      </router-link>
    </el-empty>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useForm } from '../composables/useForm';

export default {
  name: 'TaskForm',
  props: {
    projectId: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const taskForm = ref(null);
    const isEditing = computed(() => !!props.taskId);
    const statusOpts = [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in-progress' },
      { label: 'Completed', value: 'completed' }
    ];

    const priorityOpts = [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' }
    ];

    const defaultForm = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: null
    };

    // form validation - maybe add more rules later
    const rules = {
      title: [
        { required: true, message: 'Please enter a task title', trigger: 'blur' },
        { min: 2, max: 100, message: 'Length should be 2 to 100 characters', trigger: 'blur' }
      ],
      description: [
        { max: 500, message: 'Description cannot exceed 500 characters', trigger: 'blur' }
      ],
      priority: [{ required: true, message: 'Please select a priority', trigger: 'change' }],
      status: [{ required: true, message: 'Please select a status', trigger: 'change' }]
    };

    const { formData, isSubmitting, errors } = useForm(defaultForm);
    const isLoading = computed(() => store.getters['projects/isLoading']);
    const projects = computed(() => store.getters['projects/allProjects']);
    const project = computed(() => {
      return projects.value.find(p => p.id === props.projectId) || null;
    });

    onMounted(async () => {
      await store.dispatch('projects/fetchProjects');

      if (!project.value) {
        return;
      }

      if (isEditing.value) {
        const task = store.getters['tasks/getTaskById'](props.projectId, props.taskId);
        console.log('task', task);
        if (task) {
          formData.title = task.title || '';
          formData.description = task.description || '';
          formData.priority = task.priority || 'medium';
          formData.status = task.status || 'pending';
          formData.dueDate = task.dueDate || null;
        } else {
          ElMessageBox.alert('Task not found.', 'Error', {
            confirmButtonText: 'OK',
            callback: () => {
              router.push({ name: 'ProjectDetail', params: { id: props.projectId } });
            }
          });
        }
      }
    });

    const submitForm = async () => {
      if (!taskForm.value) return;

      try {
        const valid = await taskForm.value.validate();
        if (!valid) return;

        if (isEditing.value) {
          await store.dispatch('tasks/updateTask', {
            projectId: props.projectId,
            task: {
              id: props.taskId,
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
              status: formData.status,
              dueDate: formData.dueDate
            }
          });

          ElMessage({
            message: 'Task updated successfully',
            type: 'success'
          });
        } else {
          await store.dispatch('tasks/addTask', {
            projectId: props.projectId,
            task: {
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
              status: formData.status,
              dueDate: formData.dueDate
            }
          });

          ElMessage({
            message: 'Task created successfully',
            type: 'success'
          });
        }

        goBack();
      } catch (err) {
        console.error('Failed to save task:', err);
        ElMessage({
          message: 'Failed to save task',
          type: 'error'
        });
      }
    };

    const goBack = () => {
      router.push({ name: 'ProjectDetail', params: { id: props.projectId } });
    };

    return {
      formData,
      isSubmitting,
      errors,
      taskForm,
      isEditing,
      isLoading,
      project,
      statusOpts,
      priorityOpts,
      rules,
      submitForm,
      goBack
    };
  }
};
</script>

<style scoped>
.task-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #303133;
}

.proj-info {
  margin-bottom: 20px;
  color: #606266;
}

.proj-info a {
  color: #409eff;
  text-decoration: none;
}

.proj-info a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
