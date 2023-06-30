import './editor.scss'
import config from '../../config'
import EditorBlock from './editor-block'
import { ElButton, ElInput } from 'element-plus'
import { editorConfig as editorConfig2 } from './editor-utils'

import { useDrag } from '../../hooks/useDrag'
import { useFocus } from '../../hooks/useFocus'
import { useMove } from '../../hooks/useMove'
import { useCommand } from '../../hooks/useCommand'
import { useDialog } from '../../hooks/useDialog'
import { BlockItem } from '../../types/editor'
import EditorConfig from './editor-config'
import deepcopy from 'deepcopy'

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
    ElInput,
    EditorConfig
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const isPreview = ref(false) // false 为编辑 true 为预览
    const editorConfig = inject<typeof editorConfig2>('editorConfig')
    const data = computed({
      get() {
        return props.modelValue as typeof config
      },
      set(val) {
        ctx.emit('update:modelValue', val)
      }
    })
    const command = useCommand(data)
    const isFocus = computed(() => {
      return data.value.blocks.find(item => item.focus)
    })

    const buttons = ref([
      {
        label: '撤销',
        handler: () => {
          command.commands.undo()
        }
      },
      {
        label: '重做',
        handler: () => {
          command.commands.redo()
        }
      },
      {
        label: '导出',
        handler: () => {
          useDialog({
            title: '导出',
            show: true,
            content: JSON.stringify(data.value.blocks),
            type: 'export'
          })
        }
      },
      {
        label: '导入',
        handler: () => {
          useDialog({
            title: '导入',
            show: true,
            content: '',
            type: 'import',
            callback(options) {
              command.commands.import(JSON.parse(options!.content) as BlockItem[])
            }
          })
        }
      },
      {
        label: '置顶',
        handler: () => {
          isFocus.value && command.commands.top()
        }
      },
      {
        label: '置底',
        handler: () => {
          isFocus.value && command.commands.bottom()
        }
      },
      {
        label: '删除',
        handler: () => {
          isFocus.value && command.commands.delete()
        }
      },
      {
        label: computed(() => (isPreview.value ? '预览' : '编辑')) as unknown as string,
        handler: () => {
          isPreview.value = isPreview.value ? false : true
        }
      }
    ])
    const containerStyle = computed(() => ({
      width: data.value.container.width,
      height: data.value.container.height
    }))

    // 1. 处理拖拽事件
    const { onDragstart, onDragend, editorContainer } = useDrag(data)
    // 2. 处理点击获得焦点
    const { handleClick, clearFocus, focusData, lastBlock, currentIndex } = useFocus(data, isPreview, e =>
      handleMove(e)
    )
    // 3. 处理拖拽事件
    const { handleMove, markLine } = useMove(focusData, lastBlock, containerStyle)
    // 处理修改设置
    const handleEditComponent = val => {
      const blocks = deepcopy(data.value.blocks)
      blocks[currentIndex.value].props = deepcopy(val)
      command.commands.updateComponent(blocks)
    }
    provide('handleEditComponent', handleEditComponent)

    const reactiveData = inject('reactiveData')
    const setCurrentRef = key => {
      const blocks = deepcopy(data.value.blocks)
      blocks[currentIndex.value].model = key
      command.commands.updateComponent(blocks)
    }
    provide('setCurrentRef', setCurrentRef)

    return () => (
      <div class="editor">
        {isPreview.value ? (
          <div onClick={() => (isPreview.value = false)}>取消</div>
        ) : (
          <>
            {/* 左侧内容区域 */}
            <div class="editor-left">
              {editorConfig!.editorComponentList.map(item => (
                <div class="editor-left-item" draggable onDragstart={e => onDragstart(e, item)} onDragend={onDragend}>
                  <span>{item.label}</span>
                  <div>{item.preview()}</div>
                </div>
              ))}
            </div>
            {/* 上方操作区域 */}
            <div class="editor-top">
              {buttons.value.map(item => (
                <div class="editor-top-button" onClick={item.handler}>
                  {item.label}
                </div>
              ))}
            </div>
            {/* 右侧配置区域 */}
            <div class="editor-right">
              {lastBlock.value ? <editor-config blocks={lastBlock.value}></editor-config> : '请选择组件'}
            </div>
          </>
        )}
        {/* 中间画布区域 */}
        <div class="editor-container">
          <div ref={editorContainer} class="editor-container-canvas">
            <div class="editor-container-canvas__content" onMousedown={clearFocus} style={containerStyle.value}>
              {/* X轴辅助线 需要用markLine 的showTop来对应 */}
              {markLine.value.y !== 0 ? (
                <div class="editor-container__mark-line-x" style={{ top: markLine.value.y + 'px' }}></div>
              ) : (
                ''
              )}
              {/* Y轴辅助线 需要用markLine 的showTop来对应 */}
              {markLine.value.x !== 0 ? (
                <div class="editor-container__mark-line-y" style={{ left: markLine.value.x + 'px' }}></div>
              ) : (
                ''
              )}
              {data.value.blocks.map((item, index) => (
                <editor-block
                  v-model:block={item}
                  onMousedown={(e: MouseEvent) => handleClick(e, item, index)}
                  class={item.focus ? 'is-focus' : ''}
                ></editor-block>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
