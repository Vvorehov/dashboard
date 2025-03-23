import { ref, reactive, computed } from 'vue';

export function useForm(initialState = {}, validationRules = {}) {
  const formData = reactive({ ...initialState });

  const errors = ref({});
  const isSubmitting = ref(false);

  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(initialState, key)) {
        formData[key] = initialState[key];
      } else {
        delete formData[key];
      }
    });

    Object.keys(initialState).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(formData, key)) {
        formData[key] = initialState[key];
      }
    });

    errors.value = {};
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldRules = validationRules[field];

      if (!fieldRules) return;

      for (const rule of fieldRules) {
        const { validator, message } = rule;
        const isFieldValid = validator(formData[field], formData);

        if (!isFieldValid) {
          newErrors[field] = message;
          isValid = false;
          break;
        }
      }
    });

    errors.value = newErrors;
    return isValid;
  };

  const isFormValid = computed(() => Object.keys(errors.value).length === 0);

  const submitForm = async submitFn => {
    isSubmitting.value = true;
    errors.value = {};

    try {
      const isValid = validateForm();

      if (!isValid) {
        return { success: false, errors: errors.value };
      }

      const result = await submitFn(formData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Form submission error:', error);
      errors.value.form = error.message || 'An error occurred during form submission';
      return { success: false, error };
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isFormValid,
    validateForm,
    submitForm,
    resetForm
  };
}
