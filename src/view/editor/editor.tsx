import './editor.scss'
import config from '../../config'
import EditorBlock from './editor-block'
import { ElButton, ElInput } from 'element-plus'
import { editorConfig as editorConfig2 } from './editor-utils'

import type { ComponentInterface } from './editor-utils'
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  components: {
    EditorBlock,
    ElButton,
    ElInput
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const editorConfig = inject<typeof editorConfig2>('editorConfig')
    const data = computed({
      get() {
        return props.modelValue as typeof config
      },
      set(val) {
        ctx.emit('update:modelValue', val)
      }
    })
    const containerStyle = computed(() => ({
      width: data.value.container.width,
      height: data.value.container.height
    }))
    const editorContainer = ref<HTMLDivElement>()
    const currentEditor = ref<ComponentInterface>()
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
      data.value.blocks.push({
        top: e.offsetY,
        left: e.offsetX,
        zIndex: 1,
        key: currentEditor.value!.key,
        alignCenter: true
      })
      // 重制component
      currentEditor.value = undefined
    }

    /* 开始拖拽时触发的事件 */
    const onDragstart = (e: DragEvent, component: ComponentInterface) => {
      // 获取当前拖拽的component配置
      currentEditor.value = component
      // 拖拽进入container
      editorContainer.value!.addEventListener('dragenter', e => dragenter(e))
      // 拖拽经过 比如阻止默认事件否则不能drop放下
      editorContainer.value!.addEventListener('dragover', dragover)
      // 拖拽离开事件
      editorContainer.value!.addEventListener('dragleave', dragleave)
      // 拖拽放下
      editorContainer.value!.addEventListener('drop', drop)
    }
    return () => (
      <div class="editor">
        <div class="editor-left">
          {editorConfig!.editorComponentList.map(item => (
            <div class="editor-left-item" draggable onDragstart={e => onDragstart(e, item)}>
              <span>{item.label}</span>
              <div>{item.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">右侧</div>
        <div class="editor-right">顶部</div>
        <div class="editor-container">
          <div ref={editorContainer} class="editor-container-canvas">
            <div class="editor-container-canvas__content" style={containerStyle.value}>
              {data.value.blocks.map(item => (
                <editor-block v-model:block={item}></editor-block>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
