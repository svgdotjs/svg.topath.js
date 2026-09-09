import { Path, Shape, extend } from '@svgdotjs/svg.js'

// Only presentation attributes are transferred to the new element. The regex
// matches the attribute itself and everything derived from it (`stroke-width`,
// `fill-opacity`, ...) but not attributes which only contain the name
// (`data-fill`) or geometry (`width`, `x`, `points`, ...)
const normaliseAttributes = (attr) => {
  const normalised = {}

  for (const key in attr) {
    if (/^(fill|stroke|opacity|transform)(-|$)/.test(key)) {
      normalised[key] = attr[key]
    }
  }

  return normalised
}

extend(Shape, {
  // Convert element to path
  toPath(replace = true) {
    var d

    switch (this.type) {
      case 'rect': {
        let {
          width: w,
          height: h,
          rx,
          ry,
          x,
          y
        } = this.attr(['width', 'height', 'rx', 'ry', 'x', 'y'])

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
          d = [['M', x, y], ['h', w], ['v', h], ['h', -w], ['v', -h], ['z']]
        }

        break
      }
      case 'circle':
      case 'ellipse': {
        let rx = this.rx()
        let ry = this.ry()
        let { cx, cy } = this.attr(['cx', 'cy'])

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

        if (this.type === 'polygon') {
          d.push('Z')
        }

        break
      case 'path':
        d = this.array()
        break
      default:
        throw new Error('SVG toPath got unsupported type ' + this.type, this)
    }

    const path = new Path().plot(d).attr(normaliseAttributes(this.attr()))

    if (replace) {
      this.replace(path)
    }

    return path
  }
})
