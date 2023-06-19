import { Block, BlockItem } from '../config'
import type { WritableComputedRef } from 'vue'
export function useFocus(data: WritableComputedRef<Block>, callback: (e: MouseEvent) => void) {
  const clearFocus = () => {
    data.value.blocks.forEach(item => (item.focus = false))
  }
  const handleClick = (e: MouseEvent, item: BlockItem) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.shiftKey) {
      item.focus = !item.focus
    } else {
      if (!item.focus) {
        clearFocus()
        item.focus = true
      } else {
        item.focus = false
      }
    }
    callback(e)
  }
  const focusData = computed(() => {
    return data.value.blocks.reduce(
      (res, item) => {
        if (item.focus) {
          res.focusList.push(item)
        } else {
          res.unFocusList.push(item)
        }
        return res
      },
      {
        focusList: [] as BlockItem[],
        unFocusList: [] as BlockItem[]
      }
    )
  })

  return {
    handleClick,
    focusData,
    clearFocus
  }
}
