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
        return props
      },
      set(val) {
        ctx.emit('update:block', val)
      }
    })
    const blockStyle = computed(() => ({
      left: data.value.block.left + 'px',
      top: data.value.block.top + 'px',
      zIndex: data.value.block.zIndex
    }))
    const editorItem = computed(() => {
      return (editorConfig as typeof editorConfig2).editorComponentMap[data.value.block.key]
    })

    onMounted(() => {
      if (data.value.block.alignCenter) {
        // 说明是拖动松手的才让位置居中
        data.value.block.left -= editor.value!.offsetWidth / 2
        data.value.block.top -= editor.value!.offsetHeight / 2
      }
    })

    return () => (
      <div ref={editor} class="editor-block" style={blockStyle.value}>
        {editorItem.value.render()}
      </div>
    )
  }
})
