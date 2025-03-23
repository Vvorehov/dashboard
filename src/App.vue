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
        <el-row v-if="isLoading" justify="center" class="loading-container">
          <el-col :span="24" class="text-center">
            <el-icon class="loading-icon">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
                ></path>
              </svg>
            </el-icon>
            <p>Loading...</p>
          </el-col>
        </el-row>

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
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { RootState } from './types';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore<RootState>();

    const isLoading = computed(
      () => store.getters['projects/isLoading'] || store.getters['tasks/isLoading']
    );

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

.loading-container {
  padding: 40px 0;
  text-align: center;
}

.loading-icon {
  font-size: 3rem;
  color: #409eff;
  animation: rotating 2s linear infinite;
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

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.text-center {
  text-align: center;
}
</style>
