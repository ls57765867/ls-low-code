import { WritableComputedRef } from 'vue'
import { BlockItem } from '../types/editor'
import { events } from './useCommand'

export function useMove(
  focusData: WritableComputedRef<{ focusList: BlockItem[]; unFocusList: BlockItem[] }>,
  lastBlock: WritableComputedRef<BlockItem>,
  containerStyle: WritableComputedRef<{ width: string; height: string }>
) {
  const markLine = ref({
    x: 0,
    y: 0
  })
  function resetMarkLine() {
    markLine.value = {
      x: 0,
      y: 0
    }
  }
  // 处理拖拽的逻辑·
  function handleMove(e: MouseEvent) {
    events.emit('start')
    let startClint = {
      x: e.clientX,
      y: e.clientY,
      lines: {
        x: [] as any,
        y: [] as any
      },
      isMove: false
    }

    // 为未选中与unFocusList 与中轴线添加辅助线
    const BWidth = lastBlock.value.width
    const BHeight = lastBlock.value.height
    focusData.value.unFocusList.forEach(item => {
      // 获取y轴上的5个点 showTop表示辅助线出现的位置 top代表B多高时触发辅助线
      startClint.lines.y.push({
        showTop: item.top + item.height! / 2,
        top: item.top + item.height! / 2 - BHeight! / 2
      }) // A中对B中
      startClint.lines.y.push({ showTop: item.top, top: item.top }) // A顶对B顶
      startClint.lines.y.push({ showTop: item.top, top: item.top - BHeight! }) // A顶对B底
      startClint.lines.y.push({ showTop: item.top + item.height!, top: item.top + item.height! }) // A底对B顶
      startClint.lines.y.push({ showTop: item.top + item.height!, top: item.top + item.height! - BHeight! }) // A底对B底

      startClint.lines.x.push({
        showLeft: item.left + item.width! / 2,
        left: item.left + item.width! / 2 - BWidth! / 2
      }) // A中对B中
      startClint.lines.x.push({ showLeft: item.left, left: item.left }) // A左边对B左
      startClint.lines.x.push({ showLeft: item.left + item.width!, left: item.left + item.width! }) //
      startClint.lines.x.push({ showLeft: item.left + item.width!, left: item.left + item.width! - BWidth! }) // A底对B顶
      startClint.lines.x.push({ showLeft: item.left, left: item.left - BWidth! }) //  A左对B右
    })

    // move事件改编每个item移动的位置
    const mousemove = (e: MouseEvent) => {
      startClint.isMove = true
      let durX = e.clientX - startClint.x
      let durY = e.clientY - startClint.y
      let left = lastBlock.value.left + durX
      let top = lastBlock.value.top + durY
      let x = 0
      let y = 0
      resetMarkLine()
      for (let i = 0; i < startClint.lines.x.length; i++) {
        if (Math.abs(startClint.lines.x[i].left - left) < 10) {
          x = startClint.lines.x[i].left - left
          markLine.value.x = startClint.lines.x[i].showLeft
          break
        }
      }

      for (let i = 0; i < startClint.lines.y.length; i++) {
        if (Math.abs(startClint.lines.y[i].top - top) < 10) {
          y = startClint.lines.y[i].top - top
          markLine.value.y = startClint.lines.y[i].showTop
          break
        }
      }

      startClint = Object.assign({}, startClint, {
        x: e.clientX + x,
        y: e.clientY + y
      })
      focusData.value.focusList.forEach(item => {
        item.left += durX + x
        item.top += durY + y
      })
    }
    // 当松开鼠标时删除对应的事件
    const mouseup = () => {
      resetMarkLine()
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      nextTick(() => {
        if (startClint.isMove) {
          events.emit('end')
        }
      })
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }
  return {
    handleMove,
    markLine
  }
}
