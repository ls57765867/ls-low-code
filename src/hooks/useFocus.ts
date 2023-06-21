import type { Block, BlockItem } from '../types/editor'
import type { WritableComputedRef } from 'vue'
// eslint-disable-next-line no-unused-vars
export function useFocus(data: WritableComputedRef<Block>, callback: (e: MouseEvent) => void) {
  // 最后选中的index和block
  const currentIndex = ref(-1)
  const lastBlock = computed(() => {
    return data.value.blocks[currentIndex.value]
  })
  // 点击container空白处删除所有的选中状态
  const clearFocus = () => {
    data.value.blocks.forEach(item => (item.focus = false))
    currentIndex.value = -1
  }
  // 计算出哪些内容是已经选中哪些是未选中
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
  /**
   * 点击block时如果按住shift 则可进行多选,如果没有按住shift 则每次进行单选
   * 记录每次选择的block下标
   * 最终执行回调 绑定拖拽事件继续执行
   * @param e 事件
   * @param item block
   * @param index 下标
   */
  const handleClick = (e: MouseEvent, item: BlockItem, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.shiftKey) {
      if (focusData.value.focusList.length <= 1) {
        item.focus = true
      } else {
        item.focus = !item.focus
      }
    } else {
      if (!item.focus) {
        clearFocus()
        item.focus = true
      }
    }
    currentIndex.value = index
    callback(e)
  }

  return {
    handleClick,
    focusData,
    clearFocus,
    lastBlock
  }
}
