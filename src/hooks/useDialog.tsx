import { ElDialog, ElButton, ElInput } from 'element-plus'
import { createVNode, defineComponent, render, Teleport } from 'vue'
import type { Options } from '../types/editor'
import type { VNode } from 'vue'
let dialog: VNode | null
const dialogComponent = defineComponent({
  props: {
    title: String,
    show: {
      type: Boolean,
      default: true
    },
    callback: Function,
    content: String,
    type: String
  },
  components: {
    ElButton,
    ElInput
  },
  setup(_props, ctx) {
    let state = reactive<Options>({
      show: true,
      title: '',
      content: '',
      type: '',
      callback: () => {}
    })
    state = Object.assign(state, toRaw(_props))

    ctx.expose({
      showDialog(options: Options) {
        state = Object.assign(state, { ...options })
      }
    })
    const handleClose = () => {
      state.show = false
    }
    const handleClick = () => {
      handleClose()
      if (!state.content) {
        state.content = '[]'
      }
      state.callback && state.callback(state)
    }
    return () => (
      <>
        <Teleport to="body" disabled={!state.show}>
          <ElDialog v-model={state.show} title={state.title}>
            {{
              default: () => (
                <div style="height:300px">
                  <el-input type="textarea" v-model={state.content} rows="10"></el-input>
                </div>
              ),
              footer: () =>
                state.type === 'import' ? (
                  <div>
                    <el-button onClick={handleClose}>关闭</el-button>
                    <el-button type="primary" onClick={handleClick}>
                      确定
                    </el-button>
                  </div>
                ) : (
                  ''
                )
            }}
          </ElDialog>
        </Teleport>
      </>
    )
  }
})

export function useDialog(options: Options) {
  if (!dialog) {
    const el = document.createElement('div')
    const node = createVNode(dialogComponent, { ...options })
    render(node, el)
    dialog = node
  } else {
    dialog.component?.exposed?.showDialog(options)
  }
}
