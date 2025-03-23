import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const HomePage = () => import('../views/HomePage.vue');
const ProjectDetail = () => import('../views/ProjectDetail.vue');
const ProjectForm = () => import('../views/ProjectForm.vue');
const TaskForm = () => import('../views/TaskForm.vue');
const NotFound = () => import('../views/NotFound.vue');

// Get the base URL from Vite's environment variable
const base = import.meta.env.BASE_URL;

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: {
      title: 'Task Dashboard - Projects'
    }
  },
  {
    path: '/projects/new',
    name: 'NewProject',
    component: ProjectForm,
    meta: {
      title: 'Create New Project'
    }
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: ProjectForm,
    props: true,
    meta: {
      title: 'Edit Project'
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    props: true,
    meta: {
      title: 'Project Details'
    }
  },
  {
    path: '/projects/:projectId/tasks/new',
    name: 'NewTask',
    component: TaskForm,
    props: true,
    meta: {
      title: 'Create New Task'
    }
  },
  {
    path: '/projects/:projectId/tasks/:taskId/edit',
    name: 'EditTask',
    component: TaskForm,
    props: true,
    meta: {
      title: 'Edit Task'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(base),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Task Dashboard';
  next();
});

export default router; 