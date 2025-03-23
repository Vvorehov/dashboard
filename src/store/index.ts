import { createStore } from 'vuex';
import projects from './modules/projects';
import tasks from './modules/tasks';

// ToDo: might add user module later
export default createStore({
  modules: {
    projects,
    tasks
  }
}); 