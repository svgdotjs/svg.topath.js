
import { Path, Shape, extend } from '@svgdotjs/svg.js'

// Normalise attributes
const normaliseAttributes = (attr) => {
  const normalised = {}

  for (const a in attr) {
    if (/^(fill|stroke|opacity|transform)/.test(a)) { normalised[a] = attr[a] }
  }

  return normalised
}

extend(Shape, {
  // Convert element to path
  toPath (replace = true) {
    var d

    switch (this.type) {
    case 'rect': {
      const w = this.attr('width') || 0
      const h = this.attr('height') || 0
      let rx = this.attr('rx') || 0
      let ry = this.attr('ry') || 0
      const x = this.attr('x') || 0
      const y = this.attr('y') || 0

      // normalise radius values, just like the original does it (or should do)
      if (rx < 0) rx = 0
      if (ry < 0) ry = 0
      rx = rx || ry
      ry = ry || rx
      if (rx > w / 2) rx = w / 2
      if (ry > h / 2) ry = h / 2

      if (rx && ry) {
        // if there are round corners

        d = [
          ['M', rx + x, y],
          ['h', w - 2 * rx],
          ['a', rx, ry, 0, 0, 1, rx, ry],
          ['v', h - 2 * ry],
          ['a', rx, ry, 0, 0, 1, -rx, ry],
          ['h', -w + 2 * rx],
          ['a', rx, ry, 0, 0, 1, -rx, -ry],
          ['v', -h + 2 * ry],
          ['a', rx, ry, 0, 0, 1, rx, -ry],
          ['z']
        ]
      } else {
        // no round corners, no need to draw arcs
        d = [
          ['M', x, y],
          ['h', w],
          ['v', h],
          ['h', -w],
          ['v', -h],
          ['z']
        ]
      }

      break
    }
    case 'circle':
    case 'ellipse': {
      const rx = this.rx() || 0
      const ry = this.ry() || 0
      const cx = this.attr('cx') || 0
      const cy = this.attr('cy') || 0

      d = [
        ['M', cx - rx, cy],
        ['A', rx, ry, 0, 0, 0, cx + rx, cy],
        ['A', rx, ry, 0, 0, 0, cx - rx, cy],
        ['z']
      ]

      break
    }
    case 'polygon':
    case 'polyline':
    case 'line':

      d = this.array().map(function (arr) {
        return ['L'].concat(arr)
      })

      d[0][0] = 'M'

      if (this.type === 'polygon') { d.push('Z') }

      break
    case 'path':
      d = this.array()
      break
    default:
      throw new Error('SVG toPath got unsupported type ' + this.type, this)
    }

    const path = new Path()
      .plot(d)
      .attr(normaliseAttributes(this.attr()))

    if (replace) {
      this.replace(path)
    }

    return path
  }

})
