import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createHTMLWindow } from 'svgdom'
import { Path, registerWindow, SVG, Shape } from '@svgdotjs/svg.js'
import '../src/svg.topath.js'

const window = createHTMLWindow()
const document = window.document
registerWindow(window, document)

const draw = SVG().addTo(document.documentElement)

describe('toPath() registration', () => {
  it('is registered on Shape.prototype', () => {
    assert.strictEqual(typeof Shape.prototype.toPath, 'function')
  })

  it('is available on freshly created elements', () => {
    assert.strictEqual(typeof draw.path('M10 10').toPath, 'function')
    assert.strictEqual(typeof draw.rect(10, 10).toPath, 'function')
  })

  it('returns a path instance', () => {
    const rect = draw.rect(200, 100).move(100, 100)
    assert.ok(rect.toPath() instanceof Path)
  })
})

describe('toPath() from rect', () => {
  it('creates a path without angles', () => {
    const rect = draw.rect(200, 100).move(100, 100)
    assert.ok(!/A/gi.test(rect.toPath().attr('d')))
  })

  it('does it correctly without rounded angles', () => {
    const rect = draw.rect(200, 100).move(100, 100)
    assert.deepStrictEqual(
      [...rect.toPath().array()],
      [['M', 100, 100], ['H', 300], ['V', 200], ['H', 100], ['V', 100], ['Z']],
    )
  })

  it('creates a path with angles if rx and ry are given', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: 30, ry: 10 })
    assert.ok(/A/gi.test(rect.toPath().attr('d')))
  })

  it('does it correctly with rounded angles (reads rx/ry via attr(array))', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: 30, ry: 10 })
    assert.deepStrictEqual(
      [...rect.toPath().array()],
      [
        ['M', 130, 100],
        ['H', 270],
        ['A', 30, 10, 0, 0, 1, 300, 110],
        ['V', 190],
        ['A', 30, 10, 0, 0, 1, 270, 200],
        ['H', 130],
        ['A', 30, 10, 0, 0, 1, 100, 190],
        ['V', 110],
        ['A', 30, 10, 0, 0, 1, 130, 100],
        ['Z'],
      ],
    )
  })

  it('creates a path with angles if only rx is given', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: 25.5 })
    assert.ok(/A/gi.test(rect.toPath().attr('d')))
  })

  it('creates a path with angles if only ry is given', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ ry: 0.2 })
    assert.ok(/A/gi.test(rect.toPath().attr('d')))
  })

  it('creates a path without angles if rx is negative', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: -10 })
    assert.ok(!/A/gi.test(rect.toPath().attr('d')))
  })

  it('caps radii to half width and height', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: 3000, ry: 1000 })
    rect.toPath()
    assert.strictEqual(rect.width(), 200)
    assert.strictEqual(rect.height(), 100)
  })

  it('does not fail when rx/ry/x/y are not set at all', () => {
    const rect = draw.rect(200, 100)
    assert.ok(rect.toPath() instanceof Path)
  })

  it('reads the same values as the array form of attr()', () => {
    const rect = draw.rect(200, 100).move(100, 100).attr({ rx: 30, ry: 10 })
    const fromArray = rect.attr(['width', 'height', 'rx', 'ry', 'x', 'y'])
    assert.strictEqual(rect.attr('width'), fromArray.width)
    assert.strictEqual(rect.attr('height'), fromArray.height)
    assert.strictEqual(rect.attr('rx'), fromArray.rx)
    assert.strictEqual(rect.attr('ry'), fromArray.ry)
    assert.strictEqual(rect.attr('x'), fromArray.x)
    assert.strictEqual(rect.attr('y'), fromArray.y)
  })
})

describe('toPath() from circle', () => {
  it('creates a path with angles', () => {
    const circle = draw.circle(150)
    assert.ok(/A/gi.test(circle.toPath().attr('d')))
  })

  it('does it correctly', () => {
    const circle = draw.circle(150).move(100, 120)
    assert.deepStrictEqual(
      [...circle.toPath().array()],
      [
        ['M', 100, 195],
        ['A', 75, 75, 0, 0, 0, 250, 195],
        ['A', 75, 75, 0, 0, 0, 100, 195],
        ['Z'],
      ],
    )
  })
})

describe('toPath() from ellipse', () => {
  it('creates a path with angles', () => {
    const ellipse = draw.ellipse(150, 80)
    assert.ok(/A/gi.test(ellipse.toPath().attr('d')))
  })

  it('does it correctly', () => {
    const ellipse = draw.ellipse(150, 80).move(100, 120)
    assert.deepStrictEqual(
      [...ellipse.toPath().array()],
      [
        ['M', 100, 160],
        ['A', 75, 40, 0, 0, 0, 250, 160],
        ['A', 75, 40, 0, 0, 0, 100, 160],
        ['Z'],
      ],
    )
  })
})

describe('toPath() from polygon or polyline', () => {
  it('does it correctly', () => {
    const polygon = draw.polygon(
      '47.553,15.451 76.942,0 71.329,32.725 95.105,55.901 62.248,60.676 47.553,90.451 32.858,60.676 0,55.901 23.776,32.725 18.164,0',
    )
    assert.deepStrictEqual(
      [...polygon.toPath().array()],
      [
        ['M', 47.553, 15.451],
        ['L', 76.942, 0],
        ['L', 71.329, 32.725],
        ['L', 95.105, 55.901],
        ['L', 62.248, 60.676],
        ['L', 47.553, 90.451],
        ['L', 32.858, 60.676],
        ['L', 0, 55.901],
        ['L', 23.776, 32.725],
        ['L', 18.164, 0],
        ['Z'],
      ],
    )
  })

  it('polyline does not close the path', () => {
    const polyline = draw.polyline('0,0 100,0 50,100')
    const d = polyline.toPath().attr('d')
    assert.ok(/M/.test(d))
    assert.ok(!/Z/.test(d))
  })
})

describe('toPath() from line', () => {
  it('does it correctly', () => {
    const line = draw.line(0, 100, 100, 0)
    assert.deepStrictEqual(
      [...line.toPath().array()],
      [
        ['M', 0, 100],
        ['L', 100, 0],
      ],
    )
  })
})

describe('toPath() from path', () => {
  it('generates a path', () => {
    const path = draw.path('M10 10 L100 10')
    assert.ok(path.toPath() instanceof Path)
  })
})

describe('attribute transfer', () => {
  it('transfers fill, stroke, opacity and transform only', () => {
    const rect = draw
      .rect(200, 100)
      .fill({ color: '#f06', opacity: 0.5 })
      .stroke({ color: '#ff6', opacity: 1, width: 5 })
      .opacity(0.8)
      .scale(2, 0, 0)

    const path = rect.toPath()

    assert.strictEqual(path.attr('stroke'), rect.attr('stroke'))
    assert.strictEqual(path.attr('fill'), rect.attr('fill'))
    assert.strictEqual(path.attr('opacity'), rect.attr('opacity'))
    assert.strictEqual(path.transform('scaleX'), 2)
  })

  it('never copies non-transferable attributes onto the path', () => {
    const rect = draw
      .rect(200, 100)
      .fill({ color: '#f06', opacity: 0.5 })
      .stroke({ color: '#ff6', opacity: 1, width: 5 })
      .attr({ width: 200, height: 100, 'data-x': 1 })
    const path = rect.toPath()
    assert.strictEqual(path.node.getAttribute('width'), null)
    assert.strictEqual(path.node.getAttribute('height'), null)
    assert.strictEqual(path.node.getAttribute('data-x'), null)
    assert.strictEqual(path.node.getAttribute('stroke-width'), null)
    assert.strictEqual(path.node.getAttribute('stroke-opacity'), null)
    assert.strictEqual(path.node.getAttribute('fill-opacity'), null)
  })
})
