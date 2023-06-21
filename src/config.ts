import { Block } from './types/editor'

const block: Block = {
  container: {
    width: '550px',
    height: '700px'
  },
  blocks: [
    // { top: 100, left: 100, zIndex: 1, key: 'text' },
    { top: 100, left: 200, zIndex: 1, key: 'button' },
    { top: 200, left: 100, zIndex: 1, key: 'input' }
  ],
  test: 'test'
}

export default block
