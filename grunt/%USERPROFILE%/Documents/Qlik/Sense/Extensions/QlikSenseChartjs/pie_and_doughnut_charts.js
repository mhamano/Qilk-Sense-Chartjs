var visualize = function($element, layout, _this) {
  var id  = layout.qInfo.qId + "_chartjs_bar";
  var ext_width = $element.width(), ext_height = $element.height();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = ext_width - margin.left - margin.right,
      height = ext_height - margin.top - margin.bottom;

  //$element.empty();
  $element.html('<canvas id="' + id + '" width="' + width + '" height="'+ height + '"></canvas>');

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
      type: 'pie',
      data: {
          labels: data.map(function(d) { return d[0].qText; }),
          datasets: [{
              label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
              fill: layout.background_color_switch,
              data: data.map(function(d) { return d[1].qNum; }),
              backgroundColor: palette,
              borderColor: palette,
              pointBackgroundColor: palette,
              borderWidth: 1
          }]
      },
      options: {
        title:{
            display: layout.title_switch,
            text: layout.title
        },
        legend: {
          onClick:function(evt, legendItem) {
            var values = [];
            var dim = 0;
            if(data[legendItem.index][0].qElemNumber<0) {
              //do nothing
            } else {
              values.push(data[legendItem.index][0].qElemNumber);
              _this.selectValues(dim, values, true);
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
