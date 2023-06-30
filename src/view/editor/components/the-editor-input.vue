<template>
  <div>
    <el-form label-width="80px" :inline="false" label-position="top">
      <el-form-item label="绑定字段">
        <el-select v-model="inputValue">
          <el-option v-for="item in reactiveDataKeys" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-row>
          <el-col :span="12"><el-button type="primary" @click="onSubmit">应用</el-button></el-col>
          <el-col :span="12"><el-button>取消</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import deepcopy from 'deepcopy'
import { reactive, toRefs } from 'vue'
const state = reactive({
  inputValue: ''
})
const setCurrentRef = inject('setCurrentRef')
const reactiveData = inject('reactiveData')
const reactiveDataKeys = computed(() => Object.keys(reactiveData))

const { inputValue } = toRefs(state)

const onSubmit = () => {
  setCurrentRef(state.inputValue)
}
</script>

<style scoped></style>
