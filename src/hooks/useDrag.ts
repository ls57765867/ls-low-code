import { ComponentInterface } from '../view/editor/editor-utils'
import { events } from './useCommand'

import type { WritableComputedRef } from 'vue'
import type { Block } from '../types/editor'

export function useDrag(data: WritableComputedRef<Block>) {
  const editorContainer = ref<HTMLDivElement>()
  const currentEditor = ref<ComponentInterface>()
  const temp = (e: DragEvent) => dragenter(e)
  const dragenter = (e: DragEvent) => {
    // 修改h5默认的拖动图标
    e.dataTransfer!.dropEffect = 'move'
  }
  const dragover = (e: DragEvent) => {
    e.preventDefault()
  }
  const dragleave = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = 'none'
  }
  const drop = (e: DragEvent) => {
    data.value = {
      ...data.value,
      blocks: [
        ...data.value.blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentEditor.value!.key,
          alignCenter: true,
          firstRender: true // 是否为首次渲染,首次渲染才剧中
        }
      ]
    }
    // 重制component
    currentEditor.value = undefined
  }

  /* 开始拖拽时触发的事件 */
  const onDragstart = (e: DragEvent, component: ComponentInterface) => {
    // 获取当前拖拽的component配置
    currentEditor.value = component
    // 拖拽进入container
    editorContainer.value!.addEventListener('dragenter', temp)
    // 拖拽经过 比如阻止默认事件否则不能drop放下
    editorContainer.value!.addEventListener('dragover', dragover)
    // 拖拽离开事件
    editorContainer.value!.addEventListener('dragleave', dragleave)
    // 拖拽放下
    editorContainer.value!.addEventListener('drop', drop)
    events.emit('start')
  }
  const onDragend = () => {
    // // 拖拽进入container
    editorContainer.value!.removeEventListener('dragenter', temp)
    // 拖拽经过 比如阻止默认事件否则不能drop放下
    editorContainer.value!.removeEventListener('dragover', dragover)
    // 拖拽离开事件
    editorContainer.value!.removeEventListener('dragleave', dragleave)
    // 拖拽放下
    editorContainer.value!.removeEventListener('drop', drop)
    nextTick(() => {
      events.emit('end')
    })
  }
  return {
    onDragstart,
    editorContainer,
    onDragend
  }
}
