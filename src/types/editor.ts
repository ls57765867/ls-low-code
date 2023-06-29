export type BlockItem = {
  top: number
  left: number
  zIndex: number
  key?: string
  alignCenter?: boolean
  focus?: boolean
  width?: number
  height?: number
  firstRender?: boolean
}
export type Block = {
  container: any
  blocks: BlockItem[]
  test: any
}

export type Command = {
  name: string
  keyboard?: string
  init?: () => void
  before?: BlockItem[]
  after?: BlockItem[]
  pushQueue?: boolean
  execute: (blocks?: BlockItem[]) => {
    handler?: any
    back?: any
    redo?: any
  }
}

export type Options = {
  title: string
  show: boolean
  content: string
  type: string
  callback?: (options?: Options) => void
}
