var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var palette = chartjsUtils.defineColorPalette(layout.color_selection);
  
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

  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
  var uniqDim2 = [], uniqDim2ElemNum = [];

  var data = qMatrix.map(function(d) {
    if(uniqDim2.indexOf(d[1].qText) < 0){
      uniqDim2.push(d[1].qText);
      uniqDim2ElemNum[d[1].qText] = d[1].qElemNumber ;
    }
    return({
      dim1: d[0].qText,
      dim1_elem: d[0].qElemNumber,
      dim2: d[1].qText,
      mea1: d[2].qNum
    });
  })

  // Sort by Alphabetic order
  if (layout.sort) {
    uniqDim2.sort()
  }
  //Group by dimension1
  var dataGroupedBy = _.groupBy(data, 'dim1')

  //Create a container for result
  var result = [];
  result["dim1"] = [];
  result["dim1_elem"] = [];

  // Initialize arrays for dimension values
   for(var i=0; i<uniqDim2.length; i++) {
     // zero reset on result array
     var zeroArray = [];
     for(var j=0;j<_.size(dataGroupedBy); j++) {
       zeroArray[j] = 0;
     }
     result[uniqDim2[i]] = zeroArray;
   }

  var i = 0;
  _.each(dataGroupedBy, function(d) {
      result["dim1"][i] = d[0].dim1;
      result["dim1_elem"][i] = d[0].dim1_elem;
    _.each(d, function(dd){
      result[dd.dim2][i] = dd.mea1;
    })
    i++;
  });

  // Culculate cumulative sum when cumulative switch is on
  var cumSum = 0;
  if (layout.cumulative) {
    // Loop for each dimension2
    for(var i=0; i<uniqDim2.length; i++) {
      // Acumulate values
      for(var j=0; j<result[uniqDim2[i]].length; j++) {
        if ( result["dim1_elem"][j] < 0 ) {
          //ignore dimension with "-" value
        } else {
          isNaN(result[uniqDim2[i]][j]) ? cumSum += 0 : cumSum += result[uniqDim2[i]][j];
          result[uniqDim2[i]][j] = cumSum;
        }
      }
      cumSum = 0;  //reset variable for sum
    }
  }

  // Create datasets for Chart.js rendering
  var datasets = [];
  for(var i=0; i<uniqDim2.length; i++ ) {
    var subdata = [];
    subdata.label = uniqDim2[i];
    //subdata.label = "test"
    subdata.backgroundColor = "rgba(" + palette[i] + "," + layout.opacity + ")";
    subdata.data = result[uniqDim2[i]];
    subdata.fill = layout.background_color_switch;
    subdata.borderColor = "rgba(" + palette[i] + "," + layout.opacity + ")";
    subdata.pointBackgroundColor = "#FFFFFF";
    subdata.pointRadius = layout.point_radius_size;
    datasets.push(subdata);
  }

  var barChartData = {
      labels: result["dim1"],
      datasets: datasets
  };

  var ctx = document.getElementById(id);
  var myMultipleRadar = new Chart(ctx, {
      type: 'radar',
      data: barChartData,
      options: {
          title:{
              display: layout.title_switch,
              text: layout.title
          },
          legend: {
            display: (layout.legend_position == "hide") ? false : true,
            position: layout.legend_position,
            onClick: function(evt, legendItem) {
              var values = [];
              var dim = 1;
              if(uniqDim2ElemNum[legendItem.text]<0) {
                //do nothing
              } else {
                values.push(uniqDim2ElemNum[legendItem.text]);
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
                if(result["dim1_elem"][activePoints[0]._index]<0) {
                  //do nothing
                } else {
                  values.push(result["dim1_elem"][activePoints[0]._index]);
                  _this.selectValues(dim, values, true)
                }
              }
          }
      }
  });
}
