var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var palette = chartjsUtils.defineColorPalette(layout.color_selection);

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
  if (layout.cumulative) {
    result = chartjsUtils.addCumulativeValuesOnTwoDimensions(uniqDim2, result);
  }

  // Create datasets for Chart.js rendering
  var datasets = [];
  for(var i=0; i<uniqDim2.length; i++ ) {
    var subdata = [];
    subdata.label = uniqDim2[i];
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
  var myStackedBar = new Chart(ctx, {
      type: 'line',
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
          scales: {
            xAxes: [{
              stacked: true,
              scaleLabel: {
                display: layout.datalabel_switch,
                labelString: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle
              }
            }],
            yAxes: [{
              stacked: true,
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
