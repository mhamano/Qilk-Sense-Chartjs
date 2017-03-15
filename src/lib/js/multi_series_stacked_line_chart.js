var visualize = function($element, layout, _this, chartjsUtils) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";

  var width_height = chartjsUtils.calculateMargin($element, layout);
  var width = width_height[0], height = width_height[1];

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var palette = [];
  if (layout.colors == "auto") {
    palette = chartjsUtils.defineColorPalette(layout.color_selection);
  } else {
    palette = layout.custom_colors.split("-");
  }

  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;

  var result_set = chartjsUtils.flattenData(qMatrix);
  var flatten_data = result_set[0];
  var dim2_unique_values = result_set[1];
  var dim2_unique_elem_nums = result_set[2];

  // Sort by Alphabetic order
  if (layout.sort) {
    dim2_unique_values.sort()
  }

  //Group by dimension1
  var data_grouped_by_dim1 = _.groupBy(flatten_data, 'dim1')

  //Create a container for result
  var formatted_data_array = [];
  formatted_data_array["dim1"] = [];
  formatted_data_array["dim1_elem"] = [];

  // Initialize arrays for dimension values
   formatted_data_array = chartjsUtils.initializeArrayWithZero(_.size(data_grouped_by_dim1), dim2_unique_values, formatted_data_array);

   // Store hypercube data to formatted_data_array
   formatted_data_array = chartjsUtils.storeHypercubeDataToArray(data_grouped_by_dim1, formatted_data_array);

  // Culculate cumulative sum when cumulative switch is on
  if (layout.cumulative) {
    formatted_data_array = chartjsUtils.addCumulativeValuesOnTwoDimensions(dim2_unique_values, formatted_data_array);
  }

  // Create datasets for Chart.js rendering
  var datasets = [];
  for(var i=0; i<dim2_unique_values.length; i++ ) {
    var subdata = [];
    var color_id = i;
    if (layout.colors == "auto" && layout.color_selection == "twelve") {
      color_id = i % 12
    } else if (layout.colors == "auto" && layout.color_selection == "one-handred") {
      color_id = i % 100
    } else if (layout.colors == "custom") {
      color_id = i % palette.length
    } else {}
    subdata.label = dim2_unique_values[i];
    subdata.backgroundColor = "rgba(" + palette[color_id] + "," + layout.opacity + ")";
    subdata.data = formatted_data_array[dim2_unique_values[i]];
    subdata.fill = layout.background_color_switch;
    subdata.borderColor = "rgba(" + palette[color_id] + "," + layout.opacity + ")";
    subdata.pointBackgroundColor = "#FFFFFF";
    subdata.pointRadius = layout.point_radius_size;
    datasets.push(subdata);
  }

  var chart_data = {
      labels: formatted_data_array["dim1"],
      datasets: datasets
  };

  var ctx = document.getElementById(id);
  var myStackedBar = new Chart(ctx, {
      type: 'line',
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
                beginAtZero: layout.begin_at_zero_switch,
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
              chartjsUtils.makeSelectionsOnDataPoints(formatted_data_array["dim1_elem"][activePoints[0]._index], _this);
            }
          }
      }
  });
}
