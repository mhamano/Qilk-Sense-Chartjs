var visualize = function($element, layout, _this, chartjsUtils) {
  chartjsUtils.pageExtensionData(_this, $element, layout, drawBubble);

function drawBubble($element, layout, fullMatrix) {
  var id  = layout.qInfo.qId + "_chartjs_bubble";

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
  // Color for bubbles
  var color = "rgba(" + palette[layout_color] + "," + layout.opacity + ")"

  // Color for line charts
  var line_color = [];

  if (layout.line_color_switch == "auto") {
    // When color selection is auto
    line_color[0] = "rgba(" + chartjsUtils.defineColorPalette("palette")[7] + ",1.0)";
  } else {
    // When color selection is custom and single
    if (layout.line_color_selection == "single") {
        line_color[0] = "rgba(" + chartjsUtils.defineColorPalette("palette")[layout.line_color_picker] + ",1.0)";
    } else {
      if ( layout.line_color_selection_for_measure == 'custom') {
        // Custom colors
        line_color = layout.line_custom_color.split("-");
      } else {
        // 12 colors or 100 colors
        line_color = chartjsUtils.defineColorPalette(layout.line_color_selection_for_measure);
      }
    }
  }

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  //var data = layout.qHyperCube.qDataPages[0].qMatrix;

  var data = fullMatrix;

  var num_of_measures = layout.qHyperCube.qMeasureInfo.length;

  var level_interval = "";
  var bubble_size = layout.bubble_size;
  var data_length = data.length;

  if (num_of_measures >= 3) {
    // Defines the number of levels for the bubble size of measure #3
    var num_of_levels = data_length > 30 ? 30 : data_length ;

    var min_of_mea3 = layout.qHyperCube.qMeasureInfo[2].qMin;
    var max_of_mea3 = layout.qHyperCube.qMeasureInfo[2].qMax;
    level_interval = (max_of_mea3 - min_of_mea3) >  0 ? (max_of_mea3 - min_of_mea3) / num_of_levels : max_of_mea3 / num_of_levels;
  }

  // Calculate cumulative values
  if (layout.cumulative) {
    data = chartjsUtils.addCumulativeValues(data);
  };

  // Create datasets
  var datasets = [{
      type: 'bubble',
      label: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
      data: data.map(function(d) {
        if (num_of_measures == 2 ){
          return { label: d[0].qText, x: d[1].qNum, y: d[2].qNum, r: bubble_size }
        } else {
          return { label: d[0].qText, x: d[1].qNum, y: d[2].qNum, z: d[3].qNum, r: Math.floor( ( d[3].qNum / level_interval / num_of_levels ) * bubble_size )  }
        }
      }),
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1
  }
];

// Add lines when more than 3 measures are defined
// 1st measure: x-axis, 2nd measure: y-axis, 3rd< measure: lines
if (num_of_measures >= 4) {
  for ( var i=4; i<=num_of_measures;i++) {

    // Applying color to line
    var borderColor = [];
    if ( layout.line_color_switch == "auto" || layout.line_color_selection == "single" ) {
      borderColor = line_color;
    } else {
      borderColor[0] = "rgba(" + line_color[i-4] + ",1)";
    }

    datasets.push({
        type: 'line',
        label: layout.qHyperCube.qMeasureInfo[i-1].qFallbackTitle,
        data: data.map(function(d) {
            return { label: d[0].qText, x: d[1].qNum, y: d[i].qNum }
        }),
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: borderColor,
        pointBackgroundColor: 'rgba(0,0,0,0)',
        borderWidth: layout.line_width,
        pointRadius: 0
    })
  }
}

  var ctx = document.getElementById(id);

  var myChart = new Chart(ctx, {

      data: {
          labels: data.map(function(d){
            return d[1].qNum;
          }),
          //labels: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
          datasets: datasets
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
            type: layout.xscale_mode,
            position: "bottom",
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
            },
            ticks: {
              beginAtZero: layout.begin_at_zero_switch,
              //stepSize:1,
              callback: function(value, index, values) {
                return chartjsUtils.formatMeasure(value, layout, 0);
              }
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: layout.datalabel_switch,
              labelString: layout.qHyperCube.qMeasureInfo[1].qFallbackTitle
            },
            ticks: {
              beginAtZero: layout.begin_at_zero_switch,
              callback: function(value, index, values) {
                return chartjsUtils.formatMeasure(value, layout, 1);
              }
            }
          }]
        },
        tooltips: {
            mode: 'label',
            callbacks: {
              label: function(tooltipItems, data) {
                var tooltipMessage = data.datasets[0].data[tooltipItems.index].label + ': '
                  + chartjsUtils.formatMeasure(data.datasets[0].data[tooltipItems.index].x, layout, 0) + ', '
                  + chartjsUtils.formatMeasure(data.datasets[0].data[tooltipItems.index].y, layout, 1);

                if (num_of_measures == 2) {
                  return tooltipMessage;
                } else {
                  return tooltipMessage + ', ' + chartjsUtils.formatMeasure(data.datasets[0].data[tooltipItems.index].z, layout, 2);
                }
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

}
