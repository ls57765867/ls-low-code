<template>
  <div class="app">
    <h1 style="position: fixed; right: 0; bottom: 0">{{ reactiveData.name }}</h1>
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
    const reactiveData = reactive({
      name: 'zs',
      age: 18
    })

    provide('editorConfig', editorConfig)
    provide('reactiveData', reactiveData)
    return {
      state,
      reactiveData
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
