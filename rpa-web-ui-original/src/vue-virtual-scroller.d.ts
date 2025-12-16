declare module 'vue-virtual-scroller' {
  import { DefineComponent } from 'vue'

  interface ScrollerSlotProps {
    item: any
    index: number
    active: boolean
  }

  export const RecycleScroller: DefineComponent<any, any, any, any, any, any, any, any, any, {
    default?: (props: ScrollerSlotProps) => any
  }>

  export const DynamicScroller: DefineComponent<any, any, any, any, any, any, any, any, any, {
    default?: (props: ScrollerSlotProps) => any
  }>

  export const DynamicScrollerItem: DefineComponent<any, any, any>
}
