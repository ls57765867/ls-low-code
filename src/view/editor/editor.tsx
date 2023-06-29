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
    const command = useCommand(data)
    const isFocus = computed(() => {
      return data.value.blocks.find(item => item.focus)
    })
    const buttons = [
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
      }
    ]
    const containerStyle = computed(() => ({
      width: data.value.container.width,
      height: data.value.container.height
    }))

    // 1. 处理拖拽事件
    const { onDragstart, onDragend, editorContainer } = useDrag(data)
    // 2. 处理点击获得焦点
    const { handleClick, clearFocus, focusData, lastBlock } = useFocus(data, e => handleMove(e))
    // 3. 处理拖拽事件
    const { handleMove, markLine } = useMove(focusData, lastBlock, containerStyle)
    return () => (
      <div class="editor">
        <div class="editor-left">
          {editorConfig!.editorComponentList.map(item => (
            <div class="editor-left-item" draggable onDragstart={e => onDragstart(e, item)} onDragend={onDragend}>
              <span>{item.label}</span>
              <div>{item.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">
          {buttons.map(item => (
            <div class="editor-top-button" onClick={item.handler}>
              {item.label}
            </div>
          ))}
        </div>
        <div class="editor-right">右侧</div>
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
