declare module 'danmaku-vue' {
  import { DefineComponent } from 'vue'
  
  interface DanmakuProps {
    danmus: string[]
  }
  
  const Danmaku: DefineComponent<DanmakuProps>
  export default Danmaku
}