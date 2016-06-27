var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  if (layout.color_selection == 'twelve') {
    //var palette = ["#332288", "#6699cc", "#88ccee", "#44aa99", "#117733", "#999933", "#ddcc77", "#661100", "#cc6677", "#aa4466", "#882255", "#aa4499"]
    var palette = ["51,34,136", "102,153,204", "136,204,238", "68,170,153", "17,119,51", "153,153,51", "221,204,119", "102,17,0", "204,102,119", "170,68,102", "136,34,85", "170,68,153"]
  } else {
    // var palette = ["#99c867", "#e43cd0", "#e2402a", "#66a8db", "#3f1a20", "#e5aa87", "#3c6b59", "#aa2a6b", "#e9b02e", "#7864dd", "#65e93c", "#5ce4ba", "#d0e0da", "#d796dd",
  	// 					"#64487b", "#e4e72b", "#6f7330", "#932834", "#ae6c7d", "#986717", "#e3cb70", "#408c1d", "#dd325f", "#533d1c", "#2a3c54", "#db7127", "#72e3e2", "#e2c1da",
  	// 					"#d47555", "#7d7f81", "#54ae9b", "#e9daa6", "#3a8855", "#5be66e", "#ab39a4", "#a6e332", "#6c469d", "#e39e51", "#4f1c42", "#273c1c", "#aa972e", "#8bb32a",
  	// 					"#bdeca5", "#63ec9b", "#9c3519", "#aaa484", "#72256d", "#4d749f", "#9884df", "#e590b8", "#44b62b", "#ad5792", "#c65dea", "#e670ca", "#e38783", "#29312d",
  	// 					"#6a2c1e", "#d7b1aa", "#b1e7c3", "#cdc134", "#9ee764", "#56b8ce", "#2c6323", "#65464a", "#b1cfea", "#3c7481", "#3a4e96", "#6493e1", "#db5656", "#747259",
  	// 					"#bbabe4", "#e33f92", "#d0607d", "#759f79", "#9d6b5e", "#8574ae", "#7e304c", "#ad8fac", "#4b77de", "#647e17", "#b9c379", "#8da8b0", "#b972d9", "#786279",
  	// 					"#7ec07d", "#916436", "#2d274f", "#dce680", "#759748", "#dae65a", "#459c49", "#b7934a", "#51c671", "#9ead3f", "#969a5c", "#b9976a", "#46531a", "#c0f084",
  	// 					"#76c146", "#bad0ad"
  	// 			]
    var palette = ["153,200,103", "228,60,208", "226,64,42", "102,168,219", "63,26,32", "229,170,135", "60,107,89", "170,42,107", "233,176,46", "120,100,221", "101,233,60", "92,228,186", "208,224,218", "215,150,22",
              "100,72,123", "228,231,43", "111,115,48", "147,40,52", "174,108,125", "152,103,23", "227,203,112", "64,140,29", "221,50,95", "83,61,28", "42,60,84", "219,113,39", "114,227,226", "226,193,218",
              "212,117,85", "125,127,129", "84,174,155", "233,218,166", "58,136,85", "91,230,110", "171,57,164", "166,227,50", "108,70,157", "227,158,81", "79,28,66", "39,60,28", "170,151,46", "139,179,42",
              "189,236,165", "99,236,155", "156,53,25", "170,164,132", "114,37,109", "77,116,159", "152,132,223", "229,144,184", "68,182,43", "173,87,146", "198,93,234", "230,112,202", "227,135,131", "41,49,45",
              "106,44,30", "215,177,170", "177,231,195", "205,193,52", "158,231,100", "86,184,206", "44,99,35", "101,70,74", "177,207,234", "60,116,129", "58,78,150", "100,147,225", "219,86,86", "116,114,89",
              "187,171,228", "227,63,146", "208,96,125", "117,159,121", "157,107,94", "133,116,174", "126,48,76", "173,143,172", "75,119,222", "100,126,23", "185,195,121", "141,168,176", "185,114,217", "120,98,121",
              "126,192,125", "145,100,54", "45,39,79", "220,230,128", "117,151,72", "218,230,90", "69,156,73", "183,147,74", "81,198,113", "158,173,63", "150,154,92", "185,151,106", "70,83,26", "192,240,132",
              "118,193,70", "186,208,173"
          ]
  }

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
                  return formatMeasure(value);
                }
              }
            }]
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
