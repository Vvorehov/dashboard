<template>
  <div class="app-container">
    <el-container>
      <el-header height="60px">
        <div class="header-content">
          <h1 class="app-title">
            <router-link to="/">Task Dashboard</router-link>
          </h1>
          <div class="header-actions">
            <router-link to="/" class="nav-link">
              <el-button type="primary" plain>Home</el-button>
            </router-link>
            <router-link to="/projects/new" class="nav-link">
              <el-button type="success">New Project</el-button>
            </router-link>
          </div>
        </div>
      </el-header>

      <el-main>
        <div v-if="isLoading" class="loading-indicator">
          <svg class="loading-circle" viewBox="0 0 50 50">
            <circle class="circle" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </div>

        <el-row v-if="error" justify="center" class="error-container">
          <el-col :span="24">
            <el-alert :title="error" type="error" show-icon :closable="true" @close="clearError" />
          </el-col>
        </el-row>

        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer height="50px">
        <div class="footer-content">
          <p>2025 Task Dashboard</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { RootState } from './types';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore<RootState>();
    const isTaskStatusUpdate = ref(false);

    // Modified isLoading to ignore task status updates
    const isLoading = computed(() => {
      const projectsLoading = store.getters['projects/isLoading'];
      const tasksLoading = store.getters['tasks/isLoading'];
      
      // Don't show global loading indicator for task status updates
      if (isTaskStatusUpdate.value) {
        return projectsLoading;
      }
      
      return projectsLoading || tasksLoading;
    });

    const error = computed(() => store.getters['projects/error'] || store.getters['tasks/error']);

    const clearError = (): void => {
      if (store.getters['projects/error']) {
        store.commit('projects/setError', null);
      }
      if (store.getters['tasks/error']) {
        store.commit('tasks/setError', null);
      }
    };

    return {
      isLoading,
      error,
      clearError
    };
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
}

.app-container {
  min-height: 100vh;
}

.el-header {
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
}

.app-title a {
  color: #409eff;
  text-decoration: none;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.nav-link {
  text-decoration: none;
}

.el-main {
  padding: 20px;
  min-height: calc(100vh - 110px);
  position: relative; /* For loading overlay */
}

.el-footer {
  background-color: #ffffff;
  border-top: 1px solid #e6e6e6;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #606266;
  font-size: 0.9rem;
}

.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.1); /* Light blue background */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px); /* Slight blur effect for modern look */
}

.loading-circle {
  width: 40px;
  height: 40px;
  animation: rotate 2s linear infinite;
  transform-origin: center center;
}

.circle {
  stroke: #409eff; /* Main blue */
  stroke-dasharray: 150, 200;
  stroke-dashoffset: -10;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite, color-change 3s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}

@keyframes color-change {
  0% {
    stroke: #409eff; /* Blue */
  }
  33% {
    stroke: #67c23a; /* Green */
  }
  66% {
    stroke: #e6a23c; /* Orange */
  }
  100% {
    stroke: #409eff; /* Back to blue */
  }
}

.error-container {
  margin-bottom: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-center {
  text-align: center;
}
</style>
