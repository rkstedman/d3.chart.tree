d3.chart("Tree", {
  initialize: function(options) {
    var chart = this;
    options = options || {};
    
    chart.nodeSize = options.nodeSize || 4;
    // default height and width from container
    chart.w = options.w || chart.base.attr("width");
    chart.h = options.h || chart.base.attr("height");
    
    var treeLinksBase = chart.base
      .append("g")
      .classed("tree-nodes", true)
      // if nodes are circles, nodeSize = radius
      // we subtract 2*nodeSize from overall layout size to ensure
      // that edge nodes are displayed with nodeSize margin 
      // then translate entire container by the same amount so tree is centered
      .attr("transform", "translate(" + chart.nodeSize + "," + chart.nodeSize + ")");
      
    var treeNodesBase = chart.base
      .append("g")
      .classed("tree-links", true)
      .attr("transform", "translate(" + chart.nodeSize + "," + chart.nodeSize + ")");
    
      console.log('chart.w %s, chart.h %s', chart.w, chart.h);
      console.log('[chart.w - 2*chart.nodeSize, chart.h - 2*chart.nodeSize] %o', [chart.w - 2*chart.nodeSize, chart.h - 2*chart.nodeSize]);
      
    chart.layout = d3.layout.tree()
        .size([chart.w - 2*chart.nodeSize, chart.h - 2*chart.nodeSize])
        .separation(function(a, b) { return (a.parent == b.parent ? 0.25 : 1); });
    
    chart.layer("nodes", treeNodesBase, {
      dataBind: function(root) {
        // save root - our data
        chart.root = root;
        var nodes = chart.layout.nodes(root);
        chart.nodes = nodes;
        return this.selectAll(".node")
          .data(nodes);        
      },
      // the method that creates the actual data-bound elements 
      // and sets any attributes that don’t have to do with the data
      insert: function() {
        return this.append("g")
          .attr("class", "node")
          .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
          })
          .append("circle")
          .attr("r", chart.nodeSize);
      },
      events: function() {
        
      }
      
    });

    chart.layer("links", treeLinksBase, {
      dataBind: function(root) {
        var nodes = chart.nodes || chart.layout.nodes(root);
        var links = chart.layout.links(nodes);
        return this.selectAll(".link")
          .data(links);
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
  
  // configures the width of the chart.
  // when called without arguments, returns the
  // current width.
  width: function(newWidth) {
    if (arguments.length === 0) {
      return this.w;
    }
    this.w = newWidth;
    return this;
  },

  // configures the height of the chart.
  // when called without arguments, returns the
  // current height.
  height: function(newHeight) {
    if (arguments.length === 0) {
      return this.h;
    }
    this.h = newHeight;
    return this;
  }
  
});