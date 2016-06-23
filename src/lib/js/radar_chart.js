var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

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
              backgroundColor: (layout.background_color_switch) ? palette[layout.background_color] : palette[layout.color],
              borderColor: palette[layout.color],
              pointBackgroundColor: palette[layout.color],
              borderWidth: 1,
              pointRadius: layout.point_radius_size
          }]
      },
      options: {
        title:{
            display:true,
            text:layout.title
        },
        legend: {
          onClick:function(evt, legendItem) {
            //do nothing
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
