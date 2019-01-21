# svg.topath.js

This is a plugin for the [svg.js](https://svgdotjs.github.io/) library to convert any other shape to a path.

svg.topath.js is licensed under the terms of the MIT License.


## Install

```sh
npm install @svgdotjs/svg.topath.js
```

## Usage

Include this plugin after including svg.js in your html document
or require / import it.

To convert any other shape to a path:

```javascript
var canvas = SVG().addTo('body')

var rect = canvas.rect(100, 200).attr({ rx: 10, ry: 5 })

var rectPath = rect.toPath()
```

The newly created path will **replace** the original shape by default.
If you don't want your shape to be replaced, use `toPath(false)`.

The new path is returned and can be added to the document later:

```javascript
rect = rect.toPath(false).insertAfter(rect)
```
