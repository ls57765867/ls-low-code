import { WritableComputedRef } from 'vue'
import Mitt from 'mitt'
import { render } from 'vue'
import deepclone from 'deepcopy'
import type { Block, Command } from '../types/editor'

// @ts-ignore
export const events = new Mitt()
export function useCommand(data: WritableComputedRef<Block>) {
  const state: {
    current: number
    queue: any[]
    commands: Record<string, () => void>
    commandArray: Command[]
    delArray: any[]
  } = {
    current: -1, // 指针
    queue: [], // 队列
    commands: {}, // 制作指令的映射表 redo 和undo
    commandArray: [], // 存放所有的指令
    delArray: []
  }

  // console.log(data)

  const registry = (command: Command) => {
    state.commandArray.push(command)
    state.commands[command.name] = () => {
      const { handler, back, redo } = command.execute()
      handler && handler()
      if (command.pushQueue) {
        if (state.queue.length > 0) {
          state.queue = state.queue.slice(0, state.current + 1)
        }
        state.queue.push({ redo, back })
        state.current = state.current + 1
      }
    }
  }

  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    execute() {
      return {
        handler() {
          if (state.current === -1) {
            return
          }
          const item = state.queue[state.current]
          if (item) {
            item.back && item.back()
            state.current--
          }
        }
      }
    }
  })

  registry({
    name: 'redo',
    keyboard: 'ctrl+y',
    execute() {
      return {
        handler() {
          let item = state.queue[state.current + 1]
          if (item) {
            item.redo && item.redo()
            state.current++
          }
        }
      }
    }
  })

  registry({
    name: 'drag',
    before: undefined,
    pushQueue: true,
    init() {
      const start = () => {
        this.before = deepclone(data.value.blocks)
      }

      const end = () => {
        state.commands.drag()
      }

      events.on('start', start)
      events.on('end', end)
      return () => {
        events.off('start', start)
        events.off('end', end)
      }
    },
    execute() {
      const before = this.before
      const after = deepclone(data.value.blocks)
      return {
        redo() {
          data.value = { ...data.value, blocks: after }
        },
        back() {
          data.value = { ...data.value, blocks: before! }
        }
      }
    }
  })
  ;(() => {
    state.commandArray.forEach(item => {
      if (item.init) {
        state.delArray.push(item.init())
      }
    })
  })()
  return state
}
