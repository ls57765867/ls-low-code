<template>
  <div>
    <el-form label-width="80px" :inline="false" label-position="top">
      <el-form-item label="按钮文字">
        <el-input v-model="label"></el-input>
      </el-form-item>
      <el-form-item label="按钮类型">
        <el-select v-model="type" clearable>
          <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="按钮大小">
        <el-select v-model="size" clearable>
          <el-option v-for="item in sizeOptions" :key="item" :label="item" :value="item"> </el-option>
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
import { reactive, toRefs, useAttrs } from 'vue'
const attrs = useAttrs()
const state = reactive({
  label: attrs.props.label,
  type: attrs.props.type,
  size: attrs.props.size
})
const handleEditComponent = inject('handleEditComponent')

const optionsState = reactive({
  typeOptions: ['primary', 'success', 'warning', 'danger', 'info'],
  sizeOptions: ['large', 'default', 'small']
})
const { label, type, size } = toRefs(state)
const { typeOptions, sizeOptions } = toRefs(optionsState)

const onSubmit = () => {
  handleEditComponent(deepcopy(state))
}
</script>

<style scoped></style>
