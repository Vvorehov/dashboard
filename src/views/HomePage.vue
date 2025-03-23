<template>
  <div class="home-container">
    <el-row>
      <el-col :span="24">
        <h1 class="page-title">Projects</h1>
      </el-col>
    </el-row>

    <!-- Empty state -->
    <el-empty v-if="!isLoading && projects.length === 0" description="No projects found">
      <router-link to="/projects/new">
        <el-button type="primary">Create New Project</el-button>
      </router-link>
    </el-empty>

    <!-- Projects list -->
    <el-row :gutter="20" v-else>
      <el-col
        v-for="project in projects"
        :key="project.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="project-card-wrapper"
      >
        <project-card :project="project" @delete="confirmDeleteProject" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';
import ProjectCard from '../components/projects/ProjectCard.vue';

export default {
  name: 'HomePage',
  components: {
    ProjectCard
  },
  setup() {
    const store = useStore();

    // Get projects from store
    const projects = computed(() => store.getters['projects/allProjects']);
    const isLoading = computed(() => store.getters['projects/isLoading']);

    // Fetch projects on component mount
    onMounted(() => {
      store.dispatch('projects/fetchProjects');
    });

    // Handle project deletion
    const confirmDeleteProject = project => {
      ElMessageBox.confirm(
        `Are you sure you want to delete project "${project.name}"?`,
        'Warning',
        {
          confirmButtonText: 'Yes, Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          store.dispatch('projects/deleteProject', project.id).then(() => {
            ElMessage({
              message: `Project "${project.name}" has been deleted.`,
              type: 'success'
            });
          });
        })
        .catch(() => {
          // User cancelled the deletion
        });
    };

    return {
      projects,
      isLoading,
      confirmDeleteProject
    };
  }
};
</script>

<style scoped>
.home-container {
  padding: 10px 0;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #303133;
}

.project-card-wrapper {
  margin-bottom: 20px;
}
</style>
