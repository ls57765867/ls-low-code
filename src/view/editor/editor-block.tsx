import { editorConfig as editorConfig2 } from './editor-utils'
export default defineComponent({
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  emits: ['update:block'],
  setup(props, ctx) {
    const editorConfig = inject('editorConfig')
    const editor = ref<HTMLDivElement>()
    const data = computed({
      get() {
        return props.block
      },
      set(val) {
        ctx.emit('update:block', val)
      }
    })
    const blockStyle = computed(() => ({
      left: data.value.left + 'px',
      top: data.value.top + 'px',
      zIndex: data.value.zIndex
    }))
    const editorItem = computed(() => {
      return (editorConfig as typeof editorConfig2).editorComponentMap[data.value.key]
    })

    onMounted(() => {
      if (data.value.alignCenter && data.value.firstRender) {
        // 说明是拖动松手的才让位置居中
        data.value.left -= editor.value!.offsetWidth / 2
        data.value.top -= editor.value!.offsetHeight / 2
        data.value.firstRender = false
      }
      data.value.width = editor.value!.offsetWidth
      data.value.height = editor.value!.offsetHeight
    })

    return () => (
      <div ref={editor} class="editor-block" style={blockStyle.value}>
        {editorItem.value.render()}
      </div>
    )
  }
})
