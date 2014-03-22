(function() {
  
  var chart = d3.select("#vis")
    .append("svg")
    .attr("height", 900)
    .attr("width", 1600)
    .chart("Tree");
  
  d3.json("flare.json", function(error, root) {
    chart.draw(root);
  });

  // do three examples
  // different separation
  // different colors?
  // different shapes for nodes?
  
}());