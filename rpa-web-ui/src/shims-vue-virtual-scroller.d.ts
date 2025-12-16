declare module 'vue-virtual-scroller' {
  import { DefineComponent } from 'vue'

  interface DynamicScrollerSlots {
    default?: (props: { item: any; index: number; active: boolean }) => any
  }

  export const DynamicScroller: DefineComponent<
    {
      items: any[]
      minItemSize?: number
      buffer?: number
      keyField?: string
      class?: string
    },
    {
      forceUpdate: () => void
      scrollToItem: (index: number) => void
    },
    {},
    {},
    {},
    {},
    {},
    DynamicScrollerSlots
  >

  export const DynamicScrollerItem: DefineComponent<any, any, any>
  export const RecycleScroller: DefineComponent<any, any, any>
}
