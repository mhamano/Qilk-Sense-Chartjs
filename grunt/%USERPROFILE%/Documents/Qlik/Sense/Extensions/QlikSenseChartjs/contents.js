var charts = [
  {
    name:"Bar Chart",
    id:1,
    src:"bar_chart.js",
    min_dims:1,
    max_dims:1,
    measures:1
  },
  {
    name:"Stacked Bar Chart",
    id:3,
    src:"stacked_bar_chart.js",
    min_dims:2,
    max_dims:2,
    measures:1
  }
];

var content_options = charts.map(function(d) {
  return {
    value: d.id,
    label: d.name
  }
});
