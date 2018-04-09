// Copyright © 2016 RTE Réseau de transport d’électricité
/*
Flow

Leaflet class for drawing a simple segment with an arrow on its middle that
represents its direction.

Creation:
  L.flow(<LatLng> start, <LatLng> end, <Flow options> options?)

Options:
  color: color of the segment
  weight: width of the segment
  opacity: opacity of the segment
  dir: 1 if direction is from start to end, -1 if it is from end to start, 0
    if it has no direction

Methods:
  setStyle(<Flow options> options): update the style of the directed
    segment

*/

(function() {
  'use strict';

  var d3 = require("d3");

  L.Flow = L.Polyline.extend({
    options: {
      color: "blue",
      value: 0.2,
      maxValue: 1,
      minThickness:1,
      maxThickness:20,
      opacity: 1,
      dir: "auto",
      transitionTime: 750
    },

    initialize: function(start, end, options) {
      this._start = start;
      this._end = end;
      L.Polyline.prototype.initialize.call(this, [start, end], options);
    },

    onAdd: function(map) {
      L.Polyline.prototype.onAdd.call(this, map);
      
      var container = this._container || this._renderer._rootGroup;
      container.setAttribute("class", "leaflet-zoom-hide");

      this._arrowContainer = d3.select(container).append("g");
      
      if (L.version >= "1.0") this.addInteractiveTarget(this._arrowContainer.node());
       
      this._arrow = this._arrowContainer.append("path")
        .attr("d", "M -10,-10 -10,10 10,0 Z")
        .attr("class", "leaflet-clickable leaflet-interactive");

      // add a viewreset event listener for updating layer's position, do the latter
      map.on('viewreset', this._reset, this);
      this._reset(0);
    },

    onRemove: function(map) {
      L.Polyline.prototype.onRemove.call(this, map);
      map.off('viewreset', this._reset, this);
    },

    _reset: function(duration) {
    
      var self = this;
      
      if(L.Polyline.prototype._reset){
        L.Polyline.prototype._reset.call(this);
      }
      
      
      if (typeof duration != "number") {
        duration = this.options.transitionTime;
      }

      var p1 = this._map.latLngToLayerPoint(this._start);
      var p2 = this._map.latLngToLayerPoint(this._end);

      // Middle point
      var middle = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
      // Angle of the line
      var angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
      angle = angle / Math.PI * 180;
      if (p2.x - p1.x < 0) {
        angle = 180 + angle;
      }

      // thickness of the line
      var weight = this.options.minThickness +
                     Math.abs(this.options.value) / this.options.maxValue *
                     (this.options.maxThickness - this.options.minThickness);

      // direction
      var dir;
      if (this.options.dir == "auto") {
        dir = this.options.value < 0? -1:
                this.options.value > 0? 1:
                0;
      } else dir = this.options.dir;

      // Place and rotate
      var transform = L.Util.template(
        "rotate({a}) scale({sx},{sy})",
        {
          a: angle,
          sx: 0.35 * Math.pow(weight, 2/3) * dir,
          sy: 0.35 * Math.pow(weight, 2/3)
        }
      );

      if(this._arrowContainer){
        this._arrowContainer
          .attr("transform", "translate(" + middle.x + "," + middle.y + ")")
      }

      if(this._arrow){
        this._arrow.transition()
          .duration(duration)
          .attr("transform", transform)
          .attr("fill", self.options.color)
          .attr("fill-opacity", self.options.opacity);
      }
      
      d3.select(self._path).transition()
        .duration(duration)
        .attr("stroke-width", weight)
        .attr("stroke", self.options.color)
        .attr("stroke-opacity", self.options.opacity);
    },

    _update: function(duration) {
    
      if(L.Polyline.prototype._update){
        L.Polyline.prototype._update.call(this);
      }
      
      var self = this;
      
      if (typeof duration != "number") {
        duration = this.options.transitionTime;
      }

      var p1 = this._map.latLngToLayerPoint(this._start);
      var p2 = this._map.latLngToLayerPoint(this._end);

      // Middle point
      var middle = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
      // Angle of the line
      var angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
      angle = angle / Math.PI * 180;
      if (p2.x - p1.x < 0) {
        angle = 180 + angle;
      }

      // thickness of the line
      var weight = this.options.minThickness +
                     Math.abs(this.options.value) / this.options.maxValue *
                     (this.options.maxThickness - this.options.minThickness);

      // direction
      var dir;
      if (this.options.dir == "auto") {
        dir = this.options.value < 0? -1:
                this.options.value > 0? 1:
                0;
      } else dir = this.options.dir;

      // Place and rotate
      var transform = L.Util.template(
        "rotate({a}) scale({sx},{sy})",
        {
          a: angle,
          sx: 0.35 * Math.pow(weight, 2/3) * dir,
          sy: 0.35 * Math.pow(weight, 2/3)
        }
      );

      if(this._arrowContainer){
        this._arrowContainer
          .attr("transform", "translate(" + middle.x + "," + middle.y + ")")
      }

      if(this._arrow){
        this._arrow.transition()
          .duration(duration)
          .attr("transform", transform)
          .attr("fill", self.options.color)
          .attr("fill-opacity", self.options.opacity);
      }
      
      d3.select(self._path).transition()
        .duration(duration)
        .attr("stroke-width", weight)
        .attr("stroke", self.options.color)
        .attr("stroke-opacity", self.options.opacity);
    },
    
    
    setStyle: function(options) {
      //L.Polyline.prototype.setStyle.call(this, options);
      L.Util.setOptions(this, options);
      this._reset();
    }
  });

  L.flow = function(start, end, options) {
    return new L.Flow(start, end, options);
  };
}());
