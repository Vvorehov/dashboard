<template>
  <div class="proj-form">
    <el-row>
      <el-col :span="24">
        <h1 class="title">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h1>
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <el-form
          :model="formData"
          :rules="rules"
          ref="projForm"
          label-position="top"
          @submit.prevent="save"
        >
          <el-form-item label="Project Name" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="Enter project name"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="Enter project description"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="isSubmitting">
              {{ isEditing ? 'Update Project' : 'Create Project' }}
            </el-button>
            <el-button @click="cancel" plain>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useForm } from '../composables/useForm';

export default {
  name: 'ProjectForm',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const projForm = ref(null);
    const isEditing = computed(() => !!props.id);
    const emptyForm = {
      name: '',
      description: ''
    };
    const rules = {
      name: [
        { required: true, message: 'Please enter a project name', trigger: 'blur' },
        { min: 2, max: 100, message: 'Length should be 2 to 100 characters', trigger: 'blur' }
      ],
      description: [
        { max: 500, message: 'Description cannot exceed 500 characters', trigger: 'blur' }
      ]
    };

    const { formData, isSubmitting, errors } = useForm(emptyForm);

    onMounted(async () => {
      if (isEditing.value) {
        await store.dispatch('projects/fetchProjects');

        const proj = store.getters['projects/allProjects'].find(p => p.id === props.id);

        if (proj) {
          formData.name = proj.name || '';
          formData.description = proj.description || '';
        } else {
          ElMessageBox.alert('Project not found.', 'Error', {
            confirmButtonText: 'OK',
            callback: () => {
              router.push({ name: 'Home' });
            }
          });
        }
      }
    });

    const save = async () => {
      if (!projForm.value) return;

      projForm.value.validate(async valid => {
        if (!valid) {
          // console.log('validation failed', errors)
          return;
        }

        try {
          if (isEditing.value) {
            // update existing
            await store.dispatch('projects/updateProject', {
              id: props.id,
              name: formData.name,
              description: formData.description
            });

            ElMessage({
              message: 'Project updated successfully',
              type: 'success'
            });
            router.push({ name: 'ProjectDetail', params: { id: props.id } });
          } else {
            // add new proj
            const newProj = await store.dispatch('projects/addProject', {
              name: formData.name,
              description: formData.description
            });

            ElMessage({
              message: 'Project created successfully',
              type: 'success'
            });
            router.push({ name: 'ProjectDetail', params: { id: newProj.id } });
          }
        } catch (err) {
          console.error('Error saving project:', err);
          ElMessage({
            message: 'Failed to save project',
            type: 'error'
          });
        }
      });
    };

    // go back
    const cancel = () => {
      router.back();
    };

    return {
      formData,
      isEditing,
      isSubmitting,
      errors,
      rules,
      projForm,
      save,
      cancel
    };
  }
};
</script>

<style scoped>
.proj-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #303133;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>
