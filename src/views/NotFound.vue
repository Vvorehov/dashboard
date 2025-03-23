<template>
  <div class="not-found-container">
    <el-result icon="error" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <router-link to="/">
          <el-button type="primary">Back to Home</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>
