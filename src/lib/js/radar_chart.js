var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  // Qlik Sense default palette colors
  //var palette = [ "#b0afae", "#7b7a78", "#545352", "#4477aa", "#7db8da", "#b6d7ea", "#46c646", "#f93f17", "#ffcf02", "#276e27", "#ffffff", "#000000" ];
  var palette = [ "176,175,174", "123,122,120", "84,83,82", "68,119,170", "125,184,218", "182,215,234", "70,198,70", "249,63,23", "255,207,2", "39,110,39", "255,255,255", "0,0,0" ];

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
      type: 'radar',
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: [{
              label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
              fill: layout.background_color_switch,
              data: data.map(function(d) { return d[1].qNum; }),
              backgroundColor: (layout.background_color_switch) ?  "rgba(" + palette[layout.background_color] + "," + layout.opacity + ")" : "rgba(" + palette[layout.color] + "," + layout.opacity + ")",
              borderColor: "rgba(" + palette[layout.color] + "," + layout.opacity + ")",
              pointBackgroundColor: "rgba(" + palette[layout.color] + "," + layout.opacity + ")",
              pointRadius: layout.point_radius_size,
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
                    return data.datasets[tooltipItems.datasetIndex].label +': ' + formatMeasure(tooltipItems.yLabel);
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
