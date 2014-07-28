describe('toPath()', function() {
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('from rect', function() {
    var rect

    beforeEach(function() {
      rect = draw.rect(200, 100)
    })

    it('generates a path', function() {
      expect(rect.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path without angles', function() {
      expect(rect.toPath().attr('d')).not.toMatch(/A/ig)
    })

    it('creates a path with the same dimensions', function() {
      var path = rect.toPath()
      var box = path.bbox()
      expect(rect.attr('width')).toBe(box.width)
      expect(rect.attr('height')).toBe(box.height)
    })

    it('creates a path with angles if rx and ry are given', function() {
      rect.attr({ rx: 30, ry: 10 })
      expect(rect.toPath().attr('d')).toMatch(/A/ig)
    })

    it('creates a path with angles if only rx is given', function() {
      rect.attr({ rx: 25.5 })
      expect(rect.toPath().attr('d')).toMatch(/A/ig)
    })

    it('creates a path with angles if only ry is given', function() {
      rect.attr({ ry: 0.2 })
      expect(rect.toPath().attr('d')).toMatch(/A/ig)
    })
    
    it('creates a path without angles if rx and ry are negative', function() {
      rect.attr({ rx: -10 })
      expect(rect.toPath().attr('d')).not.toMatch(/A/ig)
    })

    it('caps radii to half width and height', function() {
      rect.attr({ rx: 3000, ry: 1000 })
      expect(rect.width()).toBe(200)
      expect(rect.height()).toBe(100)
    })

  })

  describe('from circle', function() {
    var circle

    beforeEach(function() {
      circle = draw.circle(150)
    })

    it('generates a path', function() {
      expect(circle.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path with angles', function() {
      expect(circle.toPath().attr('d')).toMatch(/A/ig)
    })

    it('creates a path with the same dimensions', function() {
      var path = circle.toPath()
      var box = path.bbox()
      expect(circle.attr('rx') * 2).toBe(~~box.width)
      expect(circle.attr('ry') * 2).toBe(~~box.height)
    })

    it('creates a path at the same position', function() {
      var path = circle.move(100, 120).toPath()
      var box = path.bbox()
      expect(circle.attr('cx')).toBe(Math.round(box.cx))
      expect(circle.attr('cy')).toBe(Math.round(box.cy))
    })

  })

  describe('from ellipse', function() {
    var ellipse

    beforeEach(function() {
      ellipse = draw.ellipse(150, 80)
    })

    it('generates a path', function() {
      expect(ellipse.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path with angles', function() {
      expect(ellipse.toPath().attr('d')).toMatch(/A/ig)
    })

    it('creates a path with the same dimensions', function() {
      var path = ellipse.toPath()
      var box = path.bbox()
      expect(ellipse.attr('rx') * 2).toBe(~~box.width)
      expect(ellipse.attr('ry') * 2).toBe(~~box.height)
    })

    it('creates a path at the same position', function() {
      var path = ellipse.move(100, 120).toPath()
      var box = path.bbox()
      expect(ellipse.attr('cx')).toBe(Math.round(box.cx))
      expect(ellipse.attr('cy')).toBe(Math.round(box.cy))
    })

  })

  describe('from polygon or polyline', function() {
    var polygon

    beforeEach(function() {
      polygon = draw.polygon('47.553,15.451 76.942,0 71.329,32.725 95.105,55.901 62.248,60.676 47.553,90.451 32.858,60.676 0,55.901 23.776,32.725 18.164,0')
    })

    it('generates a path', function() {
      expect(polygon.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path without angles', function() {
      expect(polygon.toPath().attr('d')).not.toMatch(/A/ig)
    })

    it('creates a path with the same dimensions', function() {
      var path = polygon.toPath()
      var pathbox = path.bbox()
      var polybox = polygon.bbox()
      expect(~~polybox.width).toBe(~~pathbox.width)
      expect(~~polybox.height).toBe(~~pathbox.height)
    })

    it('creates a path at the same position', function() {
      var path = polygon.move(100, 120).toPath()
      var pathbox = path.bbox()
      var polybox = polygon.bbox()
      expect(~~polybox.x).toBe(~~pathbox.x)
      expect(~~polybox.y).toBe(~~pathbox.y)
    })

  })

  describe('from line', function() {
    var line

    beforeEach(function() {
      line = draw.line(0,100,100,0)
    })

    it('generates a path', function() {
      expect(line.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path without angles', function() {
      expect(line.toPath().attr('d')).not.toMatch(/A/ig)
    })

    it('creates a path with the same dimensions', function() {
      var path = line.toPath()
      var pathbox = path.bbox()
      var linebox = line.bbox()
      expect(~~linebox.width).toBe(~~pathbox.width)
      expect(~~linebox.height).toBe(~~pathbox.height)
    })

    it('creates a path at the same position', function() {
      var path = line.move(100, 120).toPath()
      var pathbox = path.bbox()
      var linebox = line.bbox()
      expect(~~linebox.x).toBe(~~pathbox.x)
      expect(~~linebox.y).toBe(~~pathbox.y)
    })

  })

  describe('from path', function() {
    var original

    beforeEach(function() {
      original = draw.path('M88.006,61.994c3.203,0,6.216-1.248,8.481-3.514C98.752,56.215,100,53.203,100,50c0-3.204-1.248-6.216-3.513-8.481 c-2.266-2.265-5.278-3.513-8.481-3.513c-2.687,0-5.237,0.877-7.327,2.496h-7.746l5.479-5.479 c5.891-0.757,10.457-5.803,10.457-11.896c0-6.614-5.381-11.995-11.994-11.995c-6.093,0-11.14,4.567-11.896,10.457l-5.479,5.479 v-7.747c1.618-2.089,2.495-4.641,2.495-7.327c0-3.204-1.247-6.216-3.513-8.481C56.216,1.248,53.204,0,50,0 c-3.204,0-6.216,1.248-8.481,3.513c-2.265,2.265-3.513,5.277-3.513,8.481c0,2.686,0.877,5.237,2.495,7.327v7.747l-5.479-5.479 c-0.757-5.89-5.803-10.457-11.896-10.457c-6.614,0-11.995,5.381-11.995,11.995c0,6.093,4.567,11.139,10.458,11.896l5.479,5.479 h-7.747c-2.089-1.619-4.641-2.496-7.327-2.496c-3.204,0-6.216,1.248-8.481,3.513C1.248,43.784,0,46.796,0,50 c0,3.203,1.248,6.216,3.513,8.48c2.265,2.266,5.277,3.514,8.481,3.514c2.686,0,5.237-0.877,7.327-2.496h7.747l-5.479,5.479 c-5.891,0.757-10.458,5.804-10.458,11.896c0,6.614,5.381,11.994,11.995,11.994c6.093,0,11.139-4.566,11.896-10.457l5.479-5.479 v7.749c-3.63,4.7-3.291,11.497,1.018,15.806C43.784,98.752,46.796,100,50,100c3.204,0,6.216-1.248,8.481-3.514 c4.309-4.309,4.647-11.105,1.018-15.806v-7.749l5.479,5.479c0.757,5.891,5.804,10.457,11.896,10.457 c6.613,0,11.994-5.38,11.994-11.994c0-6.093-4.566-11.14-10.457-11.896l-5.479-5.479h7.746 C82.769,61.117,85.319,61.994,88.006,61.994z M76.874,68.354c4.705,0,8.52,3.814,8.52,8.521c0,4.705-3.814,8.52-8.52,8.52 s-8.52-3.814-8.52-8.52l-12.33-12.33V81.98c3.327,3.328,3.327,8.723,0,12.049c-3.327,3.328-8.722,3.328-12.049,0 c-3.327-3.326-3.327-8.721,0-12.049V64.544l-12.33,12.33c0,4.705-3.814,8.52-8.52,8.52s-8.52-3.814-8.52-8.52 c0-4.706,3.814-8.521,8.52-8.521l12.33-12.33H18.019c-3.327,3.328-8.722,3.328-12.049,0c-3.327-3.326-3.327-8.721,0-12.048 s8.722-3.327,12.049,0h17.438l-12.33-12.33c-4.706,0-8.52-3.814-8.52-8.52c0-4.706,3.814-8.52,8.52-8.52s8.52,3.814,8.52,8.52 l12.33,12.33V18.019c-3.327-3.327-3.327-8.722,0-12.049s8.722-3.327,12.049,0s3.327,8.722,0,12.049v17.438l12.33-12.33 c0-4.706,3.814-8.52,8.52-8.52s8.52,3.814,8.52,8.52c0,4.705-3.814,8.52-8.52,8.52l-12.33,12.33h17.438 c3.327-3.327,8.722-3.327,12.049,0s3.327,8.722,0,12.048c-3.327,3.328-8.722,3.328-12.049,0H64.544L76.874,68.354z')
    })

    it('generates a path', function() {
      expect(original.toPath() instanceof SVG.Path).toBe(true)
    })
    
    it('creates a path with the same dimensions', function() {
      var path = original.toPath()
      var pathbox = path.bbox()
      var originalbox = original.bbox()
      expect(~~originalbox.width).toBe(~~pathbox.width)
      expect(~~originalbox.height).toBe(~~pathbox.height)
    })

    it('creates a path at the same position', function() {
      var path = original.move(100, 120).toPath()
      var pathbox = path.bbox()
      var originalbox = original.bbox()
      expect(~~originalbox.x).toBe(~~pathbox.x)
      expect(~~originalbox.y).toBe(~~pathbox.y)
    })

  })

  describe('with remove flag', function() {
    var path
    
    beforeEach(function() {
      rect = draw.rect(200, 100).attr({ rx: 10, ry: 20 })
      path = rect.toPath(true)
    })

    it('removes original element', function() {
      expect(path.parent.has(rect)).toBe(false)
    })

    it('does not reference the original', function() {
      expect(path.original).toBe(undefined)
    })

  })

  describe('references', function() {
    var path
    
    beforeEach(function() {
      rect = draw.rect(200, 100).attr({ rx: 10, ry: 20 })
      path = rect.toPath()
    })

    it('the original id', function() {
      expect(path.data('topath-id')).toBe(rect.attr('id'))
    })

    it('the original type', function() {
      expect(path.data('topath-type')).toBe(rect.type)
    })

    it('the original', function() {
      expect(path.original).toBe(rect)
    })

  })

  describe('attributes', function() {
    var path
    
    beforeEach(function() {
      rect = draw.rect(200, 100).fill({ color: '#f06', opacity: 0.5 }).opacity(0.8).stroke({ color: '#ff6', opacity: 1, width: 5 })
      path = rect.toPath()
    })

    it('stroke is transferred', function() {
      expect(path.attr('stroke')).toBe(rect.attr('stroke'))
      expect(path.attr('stroke-width')).toBe(rect.attr('stroke-width'))
      expect(path.attr('stroke-opacity')).toBe(rect.attr('stroke-opacity'))
    })

    it('fill is transferred', function() {
      expect(path.attr('fill')).toBe(rect.attr('fill'))
      expect(path.attr('fill-opacity')).toBe(rect.attr('fill-opacity'))
    })

    it('opacity is transferred', function() {
      expect(path.attr('opacity')).toBe(rect.attr('opacity'))
    })

  })
	
	describe('recursive from group', function() {
    var group

    beforeEach(function() {
      group = draw.group()
			group.polyline('0,0 100,50 50,100').attr({ id: 'p' })
			group.rect(200, 100).attr({ id: 'r' })
    })
		
    it('generates paths', function() {
			group.toPath()
			expect(getStructure(group.node)).toEqual({type: 'g',
																								children:[
																									{ type: 'polyline' },
																									{ type: 'path' },
																									{ type: 'rect' },
																									{ type: 'path' }
																								]});
    })
		it('generates paths in subgroups', function() {
			subgroup = group.group()
			var circle = subgroup.circle(100)
			
			group.toPath()
      console.log(group)
			expect(getStructure(group.node)).toEqual({type:'g',
																								children:[
																									{ type:'polyline' }
																								, { type:'path' }
																								, { type:'rect' }
																								, { type:'path' }
																								, { type:'g',children:[
																										{ type:'ellipse' }
																									, { type:'path' }
																									]}
																								]})
    })
		it('generates paths in subgroups and replaces', function() {
			subgroup = group.group();
			var circle = subgroup.circle(100);
			
			group.toPath(true);
			expect(getStructure(group.node)).toEqual({type:'g',
																								children:[
																									{type:'path'},
																									{type:'path'},
																									{type:'g',children:[
																										{type:'path'}
																									]}
																								]})
    })
  })
	describe('recursive from svg', function() {
    var nestedSVG;
    beforeEach(function() {
      nestedSVG = draw.nested();
			nestedSVG.polyline('0,0 100,50 50,100').attr({id:'p'});
			nestedSVG.rect(200, 100).attr({id:'r'});
    })
		
		function getStructure(element){
			var structure = {type:element.tagName};
			if(element.children.length > 0) {
				structure.children = [];
				for(var i=0;i<element.children.length;i++) {
					var child = element.children[i];
					structure.children.push(getStructure(child))
				}
			}
			return structure;
		}
		
    it('generates paths', function() {
			nestedSVG.toPath();
			expect(getStructure(nestedSVG.node)).toEqual({type:'svg',
																										children:[
																											{type:'polyline'},
																											{type:'path'},
																											{type:'rect'},
																											{type:'path'}
																										]});
    })
		it('generates paths in subgroups', function() {
			subgroup = nestedSVG.group();
			var circle = subgroup.circle(100);
			
			nestedSVG.toPath();
			expect(getStructure(nestedSVG.node)).toEqual({type:'svg',
																										children:[
																											{type:'polyline'},
																											{type:'path'},
																											{type:'rect'},
																											{type:'path'},
																											{type:'g',children:[
																												{type:'ellipse'},
																												{type:'path'},
																											]}
																										]});
    })
		it('generates paths in subgroups and replaces', function() {
			subgroup = nestedSVG.group();
			var circle = subgroup.circle(100);
			
			nestedSVG.toPath(true);
			expect(getStructure(nestedSVG.node)).toEqual({type:'svg',
																										children:[
																											{type:'path'},
																											{type:'path'},
																											{type:'g',children:[
																												{type:'path'}
																											]}
																										]});
    })
		it('generates paths and ignores unsupported types', function() {
			// create a node that toPath doesn't support
			draw.defs()
			draw.toPath();
			expect(getStructure(draw.node)).toEqual({	type:'svg',
																								children:[
																									{type:'svg',
																									children:[
																										{type:'polyline'},
																										{type:'path'},
																										{type:'rect'},
																										{type:'path'}
																									]},
																									{type:'defs'}
																								]});
    })
  })
  
})

