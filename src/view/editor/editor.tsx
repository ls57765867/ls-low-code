import './editor.scss'
import config from '../../config'
import EditorBlock from './editor-block'
import { ElButton, ElInput } from 'element-plus'
import { editorConfig as editorConfig2 } from './view/editor/editor-utils'
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
    return () => (
      <div class="editor">
        <div class="editor-left">
          {editorConfig.editorComponentList.map(item => (
            <div style="width:200px;height:100px">{item.preview()}</div>
          ))}
        </div>
        <div class="editor-top">右侧</div>
        <div class="editor-right">顶部</div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <div class="editor-container-canvas__content" style={containerStyle.value}>
              {data.value.blocks.map(item => (
                <editor-block block={item}></editor-block>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
