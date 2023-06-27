<template>
  <div class="app">
    <editor v-model="state" test="test"></editor>
  </div>
</template>

<script lang="ts">
import config from './config'
import { defineComponent } from 'vue'
import Editor from './view/editor/editor'
import { editorConfig } from './view/editor/editor-utils'
export default defineComponent({
  props: {},
  components: {
    Editor
  },
  setup() {
    const state = ref(config)
    provide('editorConfig', editorConfig)
    return {
      state
    }
  }
})
</script>

<style scoped lang="scss">
.app {
  position: fixed;
  left: 20px;
  top: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
