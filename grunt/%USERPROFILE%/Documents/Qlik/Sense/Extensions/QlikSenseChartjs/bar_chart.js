var viz = function($element, layout, _this) {
  var id = senseUtils.setupContainer($element,layout,"chartjs_bar");

  var palette = [
			"#b0afae",
			"#7b7a78",
			"#545352",
			"#4477aa",
			"#7db8da",
			"#b6d7ea",
			"#46c646",
			"#f93f17",
			"#ffcf02",
			"#276e27",
			"#ffffff",
			"#000000"
	];

  var data = layout.qHyperCube.qDataPages[0].qMatrix;

  if (layout.cumulative) {
    var cumSum = 0;
    for(var i=0; i<data.length; i++) {
      isNaN(cumSum)? cumSum+=0 : cumSum+=data[i].measure(1).qNum;
      data[i].measure(1).qNum = cumSum;
    }
  }

  var ctx = document.getElementById("myChart");
  
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: data.map(function(d) { return d.dim(1).qText; }),
          datasets: [{
              label: senseUtils.getMeasureLabel(1,layout),
              data: data.map(function(d) { return d.measure(1).qNum; }),
              backgroundColor: palette[layout.color],
              borderColor: palette[layout.color],
              borderWidth: 1
          }]
      },
      options: {
        title:{
            display:true,
            text:layout.title
        },
        responsive: true,
        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
        onClick: function(evt) {
            var activePoints = this.getElementsAtEvent(evt);
            if(activePoints.length > 0) {
              var values = [];
              var dim = 0;
              console.log(activePoints)
              values.push(data[activePoints[0]._index][0].qElemNumber);
              console.log(values)
              _this.selectValues(dim, values, true)
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
