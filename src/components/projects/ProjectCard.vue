<template>
  <el-card class="project-card">
    <div class="card-header">
      <h3 class="project-name">{{ project.name }}</h3>
      <div class="card-actions">
        <el-button size="small" type="danger" circle @click.stop="handleDelete">
          <el-icon><Delete /></el-icon>
        </el-button>
        <el-button size="small" type="primary" circle @click.stop="handleEdit">
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
    </div>

    <p v-if="project.description" class="project-description">
      {{ truncatedDescription }}
    </p>

    <div class="project-details">
      <div class="task-count">
        <span>{{ taskCountLabel }}</span>
      </div>
    </div>

    <div class="card-footer">
      <router-link :to="`/projects/${project.id}`">
        <el-button type="primary" plain>View Details</el-button>
      </router-link>
    </div>
  </el-card>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Edit, Delete } from '@element-plus/icons-vue';

export default {
  name: 'ProjectCard',
  components: {
    Edit,
    Delete
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const router = useRouter();

    const truncatedDescription = computed(() => {
      if (!props.project.description) return '';

      return props.project.description.length > 100
        ? props.project.description.substring(0, 100) + '...'
        : props.project.description;
    });

    const taskCountLabel = computed(() => {
      const count = props.project.tasks ? props.project.tasks.length : 0;
      return `${count} ${count === 1 ? 'task' : 'tasks'}`;
    });

    const handleEdit = () => {
      router.push({ name: 'EditProject', params: { id: props.project.id } });
    };

    const handleDelete = () => {
      emit('delete', props.project);
    };

    return {
      truncatedDescription,
      taskCountLabel,
      handleEdit,
      handleDelete
    };
  }
};
</script>

<style scoped>
.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-name {
  margin: 0;
  font-size: 1.2rem;
  color: #303133;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.project-description {
  color: #606266;
  margin-bottom: 15px;
  flex-grow: 1;
}

.project-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #909399;
  font-size: 0.9rem;
}

.card-footer {
  margin-top: auto;
  text-align: center;
}

.el-button+.el-button {
  margin-left: 0;
}
</style>
