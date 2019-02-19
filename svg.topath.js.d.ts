import { Shape, Path } from '@svgdotjs/svg.js'

declare module "@svgdotjs/svg.js" {
  interface Shape {
    toPath(replace?: boolean): Path
  }
}
