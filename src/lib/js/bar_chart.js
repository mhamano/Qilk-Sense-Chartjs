var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_bar";

  var width_height = chartjsUtils.calculateMargin($element, layout);
  var width = width_height[0], height = width_height[1];

  var palette = [];
  var layout_color = 0;
  if (layout.colors == "auto") {
    palette = chartjsUtils.defineColorPalette("palette");
    layout_color = layout.color;
  } else {
    palette = layout.custom_colors.split("-");
  }
  var color = "rgba(" + palette[layout_color] + "," + layout.opacity + ")"

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var data = layout.qHyperCube.qDataPages[0].qMatrix;

  if (layout.cumulative) {
    data = chartjsUtils.addCumulativeValues(data);
  }

  var ctx = document.getElementById(id);

  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: [{
              label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
              data: data.map(function(d) { return d[1].qNum; }),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 1
          }]
      },
      options: {
        title:{
            display: layout.title_switch,
            text: layout.title
        },
        legend: {
          display: (layout.legend_position == "hide") ? false : true,
          position: layout.legend_position,
          onClick: function(evt, legendItem) {
            //do nothing
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return chartjsUtils.formatMeasure(value, layout, 0);
              }
            }
          }]
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[tooltipItems.datasetIndex].label +': ' + chartjsUtils.formatMeasure(tooltipItems.yLabel, layout, 0);
                }
            }
        },
        responsive: true,
        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
        onClick: function(evt) {
          var activePoints = this.getElementsAtEvent(evt);
          if(activePoints.length > 0) {
            chartjsUtils.makeSelectionsOnDataPoints(data[activePoints[0]._index][0].qElemNumber, _this);
          }
        }
      }
      // options: {
      //     scales: {
      //         yAxes: [{
      //             ticks: {
      //                 beginAtZero:true
      //             }
      //         }]
      //     }
      // }
  });
}
