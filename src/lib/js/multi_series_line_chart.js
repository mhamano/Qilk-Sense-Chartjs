var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  // var palette = [
	// 		"#4477aa",
	// 		"#7db8da",
	// 		"#b6d7ea",
	// 		"#46c646",
	// 		"#f93f17",
	// 		"#ffcf02",
	// 		"#276e27",
	// 		"#ffffff",
  //     "#b0afae",
  //     "#7b7a78",
  //     "#545352",
	// 		"#000000"
	// ];

if (layout.color_selection == 'twelve') {
  var palette = ["#332288", "#6699cc", "#88ccee", "#44aa99", "#117733", "#999933", "#ddcc77", "#661100", "#cc6677", "#aa4466", "#882255", "#aa4499"]
} else {
  var palette = ["#99c867", "#e43cd0", "#e2402a", "#66a8db", "#3f1a20", "#e5aa87", "#3c6b59", "#aa2a6b", "#e9b02e", "#7864dd", "#65e93c", "#5ce4ba", "#d0e0da", "#d796dd",
						"#64487b", "#e4e72b", "#6f7330", "#932834", "#ae6c7d", "#986717", "#e3cb70", "#408c1d", "#dd325f", "#533d1c", "#2a3c54", "#db7127", "#72e3e2", "#e2c1da",
						"#d47555", "#7d7f81", "#54ae9b", "#e9daa6", "#3a8855", "#5be66e", "#ab39a4", "#a6e332", "#6c469d", "#e39e51", "#4f1c42", "#273c1c", "#aa972e", "#8bb32a",
						"#bdeca5", "#63ec9b", "#9c3519", "#aaa484", "#72256d", "#4d749f", "#9884df", "#e590b8", "#44b62b", "#ad5792", "#c65dea", "#e670ca", "#e38783", "#29312d",
						"#6a2c1e", "#d7b1aa", "#b1e7c3", "#cdc134", "#9ee764", "#56b8ce", "#2c6323", "#65464a", "#b1cfea", "#3c7481", "#3a4e96", "#6493e1", "#db5656", "#747259",
						"#bbabe4", "#e33f92", "#d0607d", "#759f79", "#9d6b5e", "#8574ae", "#7e304c", "#ad8fac", "#4b77de", "#647e17", "#b9c379", "#8da8b0", "#b972d9", "#786279",
						"#7ec07d", "#916436", "#2d274f", "#dce680", "#759748", "#dae65a", "#459c49", "#b7934a", "#51c671", "#9ead3f", "#969a5c", "#b9976a", "#46531a", "#c0f084",
						"#76c146", "#bad0ad"
				]
}

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
    uniqDim2.sort(function(a, b){
     var nameA=a[0].toLowerCase(), nameB=b[0].toLowerCase();
     if (nameA < nameB) //sort string ascending
      return -1;
     if (nameA > nameB)
      return 1;
     return 0; //default return value (no sorting)
    });
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
    subdata.backgroundColor = palette[i];
    subdata.data = result[uniqDim2[i]];
    subdata.fill = layout.background_color_switch;
    subdata.borderColor = palette[i];
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
          tooltips: {
              mode: 'label'
          },
          responsive: true,
          // scales: {
          //     xAxes: [{
          //         stacked: true,
          //     }],
          //     yAxes: [{
          //         stacked: true
          //     }]
          // },
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
