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

    <!-- Project skeleton loader for stable layout while loading -->
    <el-row :gutter="20" v-else-if="isLoading">
      <el-col
        v-for="i in 4"
        :key="i"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="project-card-wrapper"
      >
        <el-skeleton animated :throttle="500">
          <template #template>
            <div class="project-skeleton">
              <el-skeleton-item variant="text" style="width: 80%; height: 25px; margin-bottom: 15px;" />
              <el-skeleton-item variant="p" style="width: 100%; height: 80px;" />
              <el-skeleton-item variant="text" style="width: 50%; margin-top: 15px;" />
              <div style="text-align: center; margin-top: 20px;">
                <el-skeleton-item variant="button" style="width: 120px; height: 36px;" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>

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
          // Use the optimistic delete action instead of the regular one
          store.dispatch('projects/optimisticDeleteProject', project.id).then((success) => {
            if (success) {
              ElMessage({
                message: `Project "${project.name}" has been deleted.`,
                type: 'success'
              });
            }
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
  min-height: 200px; /* Minimum height to prevent jumping */
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #303133;
}

.project-card-wrapper {
  margin-bottom: 20px;
  height: 100%;
  min-height: 200px; /* Ensure cards have a minimum height */
}

.project-skeleton {
  height: 230px;
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* Add these styles for smoother transitions */
.el-row {
  transition: all 0.3s ease;
  min-height: 100px;
}
</style>
