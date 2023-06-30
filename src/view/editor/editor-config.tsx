import { defineComponent, resolveComponent, h } from 'vue'
import { Component } from 'vue'
import EditorButton from './components/the-editor-button.vue'
import EditorInput from './components/the-editor-input.vue'
export default defineComponent({
  props: {
    blocks: Object
  },
  components: {
    EditorButton,
    EditorInput
  },
  setup(props) {
    const renderComponent = computed(() => {
      const obj = {
        button: <editor-button {...props.blocks}></editor-button>,
        input: <editor-input></editor-input>
      }
      return obj[props.blocks.key]
    })
    return () => {
      return <div>{renderComponent.value}</div>
    }
  }
})
