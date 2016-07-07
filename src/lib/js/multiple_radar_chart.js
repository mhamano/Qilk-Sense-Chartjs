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
  var dim2_unique_values = [], dim2_unique_elem_nums = [];

  var data = qMatrix.map(function(d) {
    if(dim2_unique_values.indexOf(d[1].qText) < 0){
      dim2_unique_values.push(d[1].qText);
      dim2_unique_elem_nums[d[1].qText] = d[1].qElemNumber ;
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
    dim2_unique_values.sort()
  }
  //Group by dimension1
  var data_grouped_by_dim1 = _.groupBy(data, 'dim1')

  //Create a container for result
  var formatted_data_array = [];
  formatted_data_array["dim1"] = [];
  formatted_data_array["dim1_elem"] = [];

  // Initialize arrays for dimension values
   formatted_data_array = chartjsUtils.initializeArrayWithZero(_.size(data_grouped_by_dim1), dim2_unique_values, formatted_data_array);

  var i = 0;
  _.each(data_grouped_by_dim1, function(d) {
      formatted_data_array["dim1"][i] = d[0].dim1;
      formatted_data_array["dim1_elem"][i] = d[0].dim1_elem;
    _.each(d, function(dd){
      formatted_data_array[dd.dim2][i] = dd.mea1;
    })
    i++;
  });

  // Culculate cumulative sum when cumulative switch is on
  if (layout.cumulative) {
    formatted_data_array = chartjsUtils.addCumulativeValuesOnTwoDimensions(dim2_unique_values, formatted_data_array);
  }

  // Create datasets for Chart.js rendering
  var datasets = [];
  for(var i=0; i<dim2_unique_values.length; i++ ) {
    var subdata = [];
    subdata.label = dim2_unique_values[i];
    //subdata.label = "test"
    subdata.backgroundColor = "rgba(" + palette[i] + "," + layout.opacity + ")";
    subdata.data = formatted_data_array[dim2_unique_values[i]];
    subdata.fill = layout.background_color_switch;
    subdata.borderColor = "rgba(" + palette[i] + "," + layout.opacity + ")";
    subdata.pointBackgroundColor = "#FFFFFF";
    subdata.pointRadius = layout.point_radius_size;
    datasets.push(subdata);
  }

  var chart_data = {
      labels: formatted_data_array["dim1"],
      datasets: datasets
  };

  var ctx = document.getElementById(id);
  var myMultipleRadar = new Chart(ctx, {
      type: 'radar',
      data: chart_data,
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
              if(dim2_unique_elem_nums[legendItem.text]<0) {
                //do nothing
              } else {
                values.push(dim2_unique_elem_nums[legendItem.text]);
                _this.selectValues(dim, values, true);
              }
            }
          },
          scale: {
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return chartjsUtils.formatMeasure(value, layout);
              }
            }
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
              chartjsUtils.makeSelectionsOnDataPoints(formatted_data_array["dim1_elem"][activePoints[0]._index], _this);
            }
          }
      }
  });
}
