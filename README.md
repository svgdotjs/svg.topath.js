# svg.topath.js

This is a plugin for the [svg.js](https://svgdotjs.github.io/) library to convert any other shape to a path.

Svg.topath.js is licensed under the terms of the MIT License.


## Usage

Include this plugin after including svg.js in your html document.

To convert any other shape to a path:

```javascript
var draw = SVG('drawing')

var rect = draw.rect(100, 200).attr({ rx: 10, ry: 5 })

var rectPath = rect.toPath()
```

The newly created path will be inserted in the element stack right after the original.

It is also possible to replace the original with the path conversion.
Simply pass `true` as the fist argument to the `toPath` method:

```javascript
rect = rect.toPath(true)
```

## References

The original `type` and `id` are stored in data attributes for future reference:

```javascript
var rectPath = rect.toPath()

var id = rect.data('topath-id')
var type = rect.data('topath-type')
```

If the original is not removed, an internal reference will be made in the resulting path to the original:

```javascript
var rectPath = rect.toPath()

rectPath.original // -> returns rect
```


## Important
This plugin is still under development and will be improved in the coming months.
Please report issues and suggestions are welcome too.

This plugin requires svg.js v1.0rc1 or higher.