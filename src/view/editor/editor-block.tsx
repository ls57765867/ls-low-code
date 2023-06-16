export default defineComponent({
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const editorConfig = inject('editorConfig')
    const blockStyle = computed(() => ({
      left: props.block.left + 'px',
      top: props.block.top + 'px',
      zIndex: props.block.zIndex
    }))
    const editorItem = computed(() => {
      return editorConfig.editorComponentMap[props.block.key]
    })

    return () => (
      <div class="editor-block" style={blockStyle.value}>
        {editorItem.value.render()}
      </div>
    )
  }
})
