d3.chart("Tree", {
  initialize: function() {
    var chart = this;
    
    // Set Defaults
    // ------------
    chart.nodeRadius =  4;
    
    // default height and width from container
    chart.w = chart.base.attr("width");
    chart.h = chart.base.attr("height");
    // default node separation function
    chart._separation = function(a,b) { return (a.parent == b.parent ? 1 : 2); };
    // use d3's reinfeld-tilford layout as default
    chart._layout = d3.layout.tree;
    
    // default margins
    chart._margins = {
      top: 5, 
      left: 5,
      right: 5,
      bottom: 5
    };

    // this needs to somehow happen after all the initialization?
    var treeLinksBase = chart.base
      .append("g")
      .classed("tree-nodes", true)
      .attr("transform", "translate(" + chart._margins.bottom + "," + chart._margins.right + ")");
      
    var treeNodesBase = chart.base
      .append("g")
      .classed("tree-links", true)
      .attr("transform", "translate(" + chart._margins.bottom + "," + chart._margins.right + ")");
    
    chart.on("change:margins", function() {
      treeLinksBase.attr("transform", "translate(" +  chart._margins.top + "," + chart._margins.left + ")");
      treeNodesBase.attr("transform", "translate(" +  chart._margins.top + "," + chart._margins.left + ")");
    });
    
    chart.layer("nodes", treeNodesBase, {
      dataBind: function(data) {
        return this.selectAll(".node")
          .data(data.nodes);        
      },
      // the method that creates the actual data-bound elements 
      // and sets any attributes that don’t have to do with the data
      insert: function() {
        return this.append("g")
          .attr("class", "node")
          .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
          })
          // TODO: support alternative node shapes
          .append("circle")
          .attr("r", chart.nodeRadius);
      },
      events: function() {
        
      }
      
    });

    chart.layer("links", treeLinksBase, {
      dataBind: function(data) {
        return this.selectAll(".link")
          .data(data.links);
      },
      insert: function() {
        var diagonal = d3.svg.diagonal()
              .projection( function(d) { 
                return [d.x, d.y]; 
              });
              
        return this.insert("path", ":first-child")
          .attr("class", "link")
          .attr("d", diagonal);
      }
    });
 
  },
  
  // The chart transform takes a data object and runs before draw.
  // We call the layout function to calculate the x,y locations of 
  // the nodes and links and provide a "transformed" version of the data
  // with this information to the layers
  transform : function(data) {
    // save our data
    this.data = data;
    
    var width = this.w - (this._margins.right + this._margins.left);
    var height = this.h - (this._margins.top + this._margins.bottom);
    var layout = this._layout()
      .size([width, height])
      .separation(this._separation);
    
    var nodes = layout.nodes(data);
    var links = layout.links(nodes);
    return { nodes: nodes, links: links };
  },
  
  // Configuration Getters & Setters
  // -------------------------------
  // Use the following functions to configure the layout of your tree chart.
  // When called without arguments, returns the current configuration value.
  
  // Changing the height, width, margin, etc. requires recalculating layout
  // and therefore, requires a complete redraw.
  
  width: function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = newWidth;
    
    if (this.data) this.draw(this.data);
    return this;
  },

  height: function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }
    this.h = newHeight;
    
    if (this.data) this.draw(this.data);
    return this;
  },
  
  margins: function(top, right, bottom, left) {
    if (!arguments.length) {
      return this._margins;
    }
    this._margins = {
      top: top,
      right: right || top,
      bottom: bottom || top,
      left: left || top
    };
    
    this.trigger("change:margins");
    if (this.data) this.draw(this.data);
    return this;
  },
  
  // Sets the tree layout for this chart.
  // For more information about tree layouts, visit
  // [Tree Layout]('https://github.com/mbostock/d3/wiki/Tree-Layout')  
  layout: function(newLayout) {
    if(arguments.length === 0) {
      return this._layout;
    }
    this._layout = newLayout;
    if (this.data) this.draw(this.data);
    return this;
  },
  
  // Configures the space between nodes
  // For more information visit
  // [tree.separation]('https://github.com/mbostock/d3/wiki/Tree-Layout#separation')
  separation: function(newSeparation) {
    if (arguments.length === 0) {
      return this._separation;
    }
    this._separation = newSeparation;
    if (this.data) this.draw(this.data);
    return this;
  }
  
  
});