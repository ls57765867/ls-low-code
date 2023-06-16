import { ElButton, ElInput } from 'element-plus'
import type { Component } from 'vue'

function createEditorConfig() {
  const editorComponentList = [] as any[] // 左侧菜单使用的list
  const editorComponentMap = {} // 中间container中使用的

  return {
    editorComponentList,
    editorComponentMap,
    register(com) {
      editorComponentList.push(com)
      editorComponentMap[com.key] = com
    }
  }
}

export const editorConfig = createEditorConfig()

editorConfig.register({
  label: '文本',
  preview: () => '预览文本',
  render: () => '渲染文本',
  key: 'text'
})

editorConfig.register({
  label: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
  key: 'button'
})

editorConfig.register({
  label: '输入框',
  preview: () => <ElInput>预览文本</ElInput>,
  render: () => <ElInput>渲染文本</ElInput>,
  key: 'input'
})
