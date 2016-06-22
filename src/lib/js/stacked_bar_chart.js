var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_stacked_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

  var palette = [
			"#4477aa",
			"#7db8da",
			"#b6d7ea",
			"#46c646",
			"#f93f17",
			"#ffcf02",
			"#276e27",
			"#ffffff",
      "#b0afae",
      "#7b7a78",
      "#545352",
			"#000000"
	];

  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
  var uniqDim2 = [];

  var data = qMatrix.map(function(d) {
    if(uniqDim2.indexOf(d[1].qText) < 0){uniqDim2.push(d[1].qText)}
    return({
      dim1: d[0].qText,
      dim1_elem: d[0].qElemNumber,
      dim2: d[1].qText,
      mea1: d[2].qNum
    });
  })

  //Create a container for result
  var result = [];
  result["dim1"] = [];
  result["dim1_elem"] = [];

  //Initialize arrays for dimension values
  for(var i=0; i<uniqDim2.length; i++) {
    result[uniqDim2[i]] = [];
  }

  //Group by dimension1
  var dataGroupedBy = _.groupBy(data, 'dim1')
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
    datasets.push(subdata);
  }

  var barChartData = {
      labels: result["dim1"],
      datasets: datasets
  };

  var ctx = document.getElementById(id);
  var myBar = new Chart(ctx, {
      type: 'bar',
      data: barChartData,
      options: {
          title:{
              display:true,
              text:layout.title
          },
          tooltips: {
              mode: 'label'
          },
          responsive: true,
          scales: {
              xAxes: [{
                  stacked: true,
              }],
              yAxes: [{
                  stacked: true
              }]
          },
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
