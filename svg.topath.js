// svg.topath.js 0.4 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license
;(function() {

	SVG.extend(SVG.Shape, {
		// Convert element to path
		toPath: function(replace) {
			var	w, h, rx, ry, d, path
				, trans = this.transform()
				, box = this.bbox()
				, x = 0
				, y = 0
				, pointArray

			switch(this.type) {
				case 'rect':
					w  = this.attr('width')
					h  = this.attr('height')
					rx = this.attr('rx')
					ry = this.attr('ry')

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
							'M' + rx + ' ' + y
						, 'H' + (w - rx)
						, 'A' + rx + ' ' + ry + ' 0 0 1 ' + w + ' ' + ry
						, 'V' + (h - ry)
						, 'A' + rx + ' ' + ry + ' 0 0 1 ' + (w - rx) + ' ' + h
						, 'H' + rx
						, 'A' + rx + ' ' + ry + ' 0 0 1 ' + x + ' ' + (h - ry)
						, 'V' + ry
						, 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + y
						, 'z'
						]
					} else {
						// no round corners, no need to draw arcs
						d = [
							'M' + x + ' ' + y
						, 'H' + w
						, 'V' + h
						, 'H' + x
						, 'V' + y
						, 'z'
						]
					}

					x = this.attr('x')
					y = this.attr('y')

				break
				case 'circle':
				case 'ellipse':
					rx = this.type == 'ellipse' ? this.attr('rx') : this.attr('r')
					ry = this.type == 'ellipse' ? this.attr('ry') : this.attr('r')

					d = [
						'M' + rx + ' ' + y
					, 'A' + rx + ' ' + ry + ' 0 0 1 ' + (rx * 2) + ' ' + ry
					, 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx 			 + ' ' + (ry * 2)
					, 'A' + rx + ' ' + ry + ' 0 0 1 ' + x 			 + ' ' + ry
					, 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx 			 + ' ' + y
					, 'z'
					]

					x = this.attr('cx') - rx
					y = this.attr('cy') - ry
				break
				case 'polygon':
				case 'polyline':
					this.move(0,0)

					pointArray = this.array().value

					d = []

					for (var i = 0, len = pointArray.length; i < len; i++)
						d.push((i == 0 ? 'M' : 'L') + pointArray[i][0] + ' ' + pointArray[i][1])

					if (this.type == 'polygon')
						d.push('Z')

					this.move(box.x, box.y)

					x = box.x
					y = box.y
				break
				case 'line':
					this.move(0,0)

					d = [
						'M' + this.attr('x1') + ' ' + this.attr('y1')
					, 'L' + this.attr('x2') + ' ' + this.attr('y2')
					]

					this.move(box.x, box.y)

					x = box.x
					y = box.y
				break
				case 'path':
					path = this.clone()
					path.unbiased = true
					path.plot(this.attr('d'))

					x = box.x
					y = box.y
				break
				default:
					console.log('SVG toPath got unsupported type ' + this.type, this)
				break
			}

			if (Array.isArray(d)) {
				var mx = x;
				var my = y;
				if (trans != null) {
					mx = mx + trans.x;
					my = my + trans.y;
				}
				// create path element
				path = this.parent()
					.path(d.join(''), true)
					.move(mx, my)
					.attr(normaliseAttributes(this.attr()))

				// insert interpreted path after original
				this.after(path)
			}

			if (this instanceof SVG.Shape && path) {
				// store original details in data attributes
				path
					.data('topath-type', this.type)
					.data('topath-id', this.attr('id'))

				// remove original if required
				if (replace === true)
					this.remove()
				else
					path.original = this
			}

			return path
		}

	})

	SVG.extend(SVG.Parent, {
		// Recruisive path conversion
		toPath: function(replace) {
			// cloning children array so that we don't touch the paths we create
      var children = [].slice.call(this.children())

      // convert top paths
      for (var i = children.length - 1; i >= 0; i--)
        if (typeof children[i].toPath === 'function')
          children[i].toPath(sample, replace)

      return this
		}
	})

	// Normalise attributes
	function normaliseAttributes(attr) {
		for (var a in attr)
			if (!/fill|stroke|opacity/.test(a))
				delete attr[a]

		return attr
	}

}).call(this);
