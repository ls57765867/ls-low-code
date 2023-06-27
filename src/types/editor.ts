export type BlockItem = {
  top: number
  left: number
  zIndex?: number
  key?: string
  alignCenter?: boolean
  focus?: boolean
  width?: number
  height?: number
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
  execute: () => {
    handler?: any
    back?: any
    redo?: any
  }
}
