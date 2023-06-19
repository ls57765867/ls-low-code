import { WritableComputedRef } from 'vue'
import { BlockItem } from '../config'

export function useMove(focusData: WritableComputedRef<{ focusList: BlockItem[]; unFocusList: BlockItem[] }>) {
  function handleMove(e: MouseEvent) {
    let startClint = {
      x: e.clientX,
      y: e.clientY
    }

    const mousemove = (e: MouseEvent) => {
      let durX = e.clientX - startClint.x
      let durY = e.clientY - startClint.y
      focusData.value.focusList.forEach((item, index) => {
        item.left += durX
        item.top += durY
      })
      startClint = {
        x: e.clientX,
        y: e.clientY
      }
    }
    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }
  return {
    handleMove
  }
}
