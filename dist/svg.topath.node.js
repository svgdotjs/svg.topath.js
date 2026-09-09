/*!
* @svgdotjs/svg.topath.js - An extension for svg.js to convert shapes to paths
* @version 2.0.3
* https://github.com/svgdotjs/svg.topath.js
*
* @copyright Wout Fierens
* @license MIT
*
* BUILT: Wed Sep 09 2026 19:00:30 GMT+0200 (Central European Summer Time)
*/;
'use strict';

var svg_js = require('@svgdotjs/svg.js');

var normaliseAttributes = function normaliseAttributes(attr) {
  var normalised = {};

  for (var a in attr) {
    if (/^(fill|stroke|opacity|transform)/.test(a)) {
      normalised[a] = attr[a];
    }
  }

  return normalised;
};

svg_js.extend(svg_js.Shape, {
  // Convert element to path
  toPath: function toPath() {
    var replace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var d;

    switch (this.type) {
      case 'rect':
        {
          var w = this.attr('width') || 0;
          var h = this.attr('height') || 0;
          var rx = this.attr('rx') || 0;
          var ry = this.attr('ry') || 0;
          var x = this.attr('x') || 0;
          var y = this.attr('y') || 0; // normalise radius values, just like the original does it (or should do)

          if (rx < 0) rx = 0;
          if (ry < 0) ry = 0;
          rx = rx || ry;
          ry = ry || rx;
          if (rx > w / 2) rx = w / 2;
          if (ry > h / 2) ry = h / 2;

          if (rx && ry) {
            // if there are round corners
            d = [['M', rx + x, y], ['h', w - 2 * rx], ['a', rx, ry, 0, 0, 1, rx, ry], ['v', h - 2 * ry], ['a', rx, ry, 0, 0, 1, -rx, ry], ['h', -w + 2 * rx], ['a', rx, ry, 0, 0, 1, -rx, -ry], ['v', -h + 2 * ry], ['a', rx, ry, 0, 0, 1, rx, -ry], ['z']];
          } else {
            // no round corners, no need to draw arcs
            d = [['M', x, y], ['h', w], ['v', h], ['h', -w], ['v', -h], ['z']];
          }

          break;
        }

      case 'circle':
      case 'ellipse':
        {
          var _rx = this.rx() || 0;

          var _ry = this.ry() || 0;

          var cx = this.attr('cx') || 0;
          var cy = this.attr('cy') || 0;
          d = [['M', cx - _rx, cy], ['A', _rx, _ry, 0, 0, 0, cx + _rx, cy], ['A', _rx, _ry, 0, 0, 0, cx - _rx, cy], ['z']];
          break;
        }

      case 'polygon':
      case 'polyline':
      case 'line':
        d = this.array().map(function (arr) {
          return ['L'].concat(arr);
        });
        d[0][0] = 'M';

        if (this.type === 'polygon') {
          d.push('Z');
        }

        break;

      case 'path':
        d = this.array();
        break;

      default:
        throw new Error('SVG toPath got unsupported type ' + this.type, this);
    }

    var path = new svg_js.Path().plot(d).attr(normaliseAttributes(this.attr()));

    if (replace) {
      this.replace(path);
    }

    return path;
  }
});
//# sourceMappingURL=svg.topath.node.js.map
