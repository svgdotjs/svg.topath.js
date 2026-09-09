const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const dist = path.join(__dirname, '../../dist/svg.topath.node.js')

test('dist build registers toPath() (issue #15)', { skip: !fs.existsSync(dist) && 'dist not built' }, () => {
  const { createSVGWindow } = require('svgdom')
  const { registerWindow, SVG, Shape } = require('@svgdotjs/svg.js')
  require(dist)

  const window = createSVGWindow()
  registerWindow(window, window.document)

  assert.strictEqual(typeof Shape.prototype.toPath, 'function')
  const draw = SVG().addTo(window.document.documentElement)
  assert.strictEqual(typeof draw.rect(10, 10).toPath, 'function')

  const rect = draw.rect(200, 100).move(100, 100)
  assert.ok(rect.toPath().node.nodeName === 'path')
})