declare module 'danmaku-vue' {
  import { DefineComponent } from 'vue'

  interface Barrage {
    id: string
    color: string
    content: string
    time: number
  }
  interface DanmakuProps {
    danmus: Barrage[]
  }

  const Danmaku: DefineComponent<DanmakuProps>
  export default Danmaku
}
