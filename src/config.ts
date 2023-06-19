type Block = {
  container: any
  blocks: {
    top: number
    left: number
    zIndex: number
    key: string
    alignCenter?: boolean
  }[]
  test: any
}
const block: Block = {
  container: {
    width: '550px',
    height: '1000px'
  },
  blocks: [
    { top: 100, left: 100, zIndex: 1, key: 'text' },
    { top: 200, left: 200, zIndex: 1, key: 'button' },
    { top: 300, left: 300, zIndex: 1, key: 'input' }
  ],
  test: 'test'
}

export default block
