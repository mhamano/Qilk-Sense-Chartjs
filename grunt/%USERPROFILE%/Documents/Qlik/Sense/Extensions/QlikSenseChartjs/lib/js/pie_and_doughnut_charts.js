var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var palette = chartjsUtils.defineColorPalette(layout.color_selection);

  var palette_r = palette.map(function(d) {
    return "rgba(" + d + "," + layout.opacity + ")";
  });

  //format the measure values
  var formatMeasure = function(value) {
    var qType = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qType; // Format type

    // When Autoformat is selected
    if(layout.qHyperCube.qMeasureInfo[0].qIsAutoFormat) {
      return value;
    }

    // When Number or Money is selected for format
    if (qType == "F" || qType == "M" ) {
      var qFmt = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt; // Format string
      var digits = 0; //number of deciaml digits
      var prefix = "";

      // Count the number of decimal digits
      if(qFmt.indexOf(".") > 0 ) {
        if(qFmt.split(".")[1].length > 0) { digits = qFmt.split(".")[1].length }
      } else { digits = 0; }

      //If percentage is selected
      if(qFmt.substr(qFmt.length - 1,1) == "%") {
        if(digits>0){--digits}
        return (value * 100).toFixed(digits) + "%"
      }

      //Add prefix if Money is selected
      if(qType == "M") {
        prefix = qFmt.substr(0,1);
        digits = 0;
      }

      if(parseInt(value) > 1000){
        return prefix + value.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return prefix + value.toFixed(digits);
      }
    }
  } // end of formatMeasure

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

  var myRadarChart = new Chart(ctx, {
      type: layout.pie_doughnut,
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: [{
              label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
              fill: layout.background_color_switch,
              data: data.map(function(d) { return d[1].qNum; }),
              backgroundColor: palette_r,
              borderColor: palette_r,
              pointBackgroundColor: palette_r,
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
          onClick:function(evt, legendItem) {
            var values = [];
            var dim = 0;
            if(data[legendItem.index][0].qElemNumber<0) {
              //do nothing
            } else {
              values.push(data[legendItem.index][0].qElemNumber);
              _this.selectValues(dim, values, true);
            }
          }
        },
        scale: {
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              return formatMeasure(value);
            }
          }
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.labels[tooltipItems.index] +': ' + formatMeasure(data.datasets[0].data[tooltipItems.index]);
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
