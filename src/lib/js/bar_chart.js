var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  var palette = chartjsUtils.defineColorPalette("twelve");

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var data = layout.qHyperCube.qDataPages[0].qMatrix;

  if (layout.cumulative) {
    var cumSum = 0;
    for(var i=0; i<data.length; i++) {
      if(data[i][0].qElemNumber < 0) {
        //ignore dimension with "-" value
      } else {
        isNaN(cumSum)? cumSum+=0 : cumSum+=data[i][1].qNum;
        data[i][1].qNum = cumSum;
      }
    }
  }

  var ctx = document.getElementById(id);

  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: [{
              label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
              data: data.map(function(d) { return d[1].qNum; }),
              backgroundColor: "rgba(" + palette[layout.color] + "," + layout.opacity + ")",
              borderColor: "rgba(" + palette[layout.color] + "," + layout.opacity + ")",
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
                return chartjsUtils.formatMeasure(value, layout);
              }
            }
          }]
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[tooltipItems.datasetIndex].label +': ' + chartjsUtils.formatMeasure(tooltipItems.yLabel, layout);
                }
            }
        },
        responsive: true,
        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
        onClick: function(evt) {
            var activePoints = this.getElementsAtEvent(evt);

            if(activePoints.length > 0) {
              var values = [];
              var dim = 0;
              if(data[activePoints[0]._index][0].qElemNumber<0) {
                //do nothing
              } else {
                values.push(data[activePoints[0]._index][0].qElemNumber);
                _this.selectValues(dim, values, true)
              }
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
