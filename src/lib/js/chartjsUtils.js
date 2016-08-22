/*global define*/
define( [
  'jquery',
  'underscore'
], function ($,_) {
'use strict';

  return {

    defineColorPalette: function(palette_type) {
      var palette = [];
      if (palette_type == "palette") {
        // Qlik Sense default palette colors
        //var palette = [ "#b0afae", "#7b7a78", "#545352", "#4477aa", "#7db8da", "#b6d7ea", "#46c646", "#f93f17", "#ffcf02", "#276e27", "#ffffff", "#000000" ];
        palette = [ "176,175,174", "123,122,120", "84,83,82", "68,119,170", "125,184,218", "182,215,234", "70,198,70", "249,63,23", "255,207,2", "39,110,39", "255,255,255", "0,0,0" ];
      } else if (palette_type == "twelve") {
        // Qlik Sense default 12 colors
        //["#332288", "#6699cc", "#88ccee", "#44aa99", "#117733", "#999933", "#ddcc77", "#661100", "#cc6677", "#aa4466", "#882255", "#aa4499"]
        palette = ["51,34,136", "102,153,204", "136,204,238", "68,170,153", "17,119,51", "153,153,51", "221,204,119", "102,17,0", "204,102,119", "170,68,102", "136,34,85", "170,68,153"]
      // palette_type = "one-handred"
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

      return palette;
    }, // end of defineColorPalette
    formatMeasure: function(value, layout, meas_num ) {
      var qType = layout.qHyperCube.qMeasureInfo[meas_num].qNumFormat.qType; // Format type

      // When Autoformat is selected
      if(layout.qHyperCube.qMeasureInfo[meas_num].qIsAutoFormat) {
        return value;
      }

      // When Number or Money is selected for format
      if (qType == "F" || qType == "M" ) {
        var qFmt = layout.qHyperCube.qMeasureInfo[meas_num].qNumFormat.qFmt; // Format string
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
    }, // end of formatMeasure
    addCumulativeValues: function(data) {
      var cumSum = 0;
      for(var i=0; i<data.length; i++) {
        if(data[i][0].qElemNumber < 0) {
          //ignore dimension with "-" value
        } else {
          isNaN(cumSum)? cumSum+=0 : cumSum+=data[i][1].qNum;
          data[i][1].qNum = cumSum;
        }
      }
      return data;
    }, //end of addCumulativeValues
    addCumulativeValuesOnTwoDimensions: function(dim2_unique_values, result) {
      var cumSum = 0;
      // Loop for each dimension2
      for(var i=0; i<dim2_unique_values.length; i++) {
        // Acumulate values
        for(var j=0; j<result[dim2_unique_values[i]].length; j++) {
          if ( result["dim1_elem"][j] < 0 ) {
            //ignore dimension with "-" value
          } else {
            isNaN(result[dim2_unique_values[i]][j]) ? cumSum += 0 : cumSum += result[dim2_unique_values[i]][j];
            result[dim2_unique_values[i]][j] = cumSum;
          }
        }
        cumSum = 0;  //reset variable for sum
      }
      return result;
    }, //addCumulativeValuesOnTwoDimensions
    makeSelectionsOnDataPoints: function(selectedElemNumber, _this) {
      var values = [];
      var dim = 0;
      if(selectedElemNumber < 0) {
        //do nothing
      } else {
        values.push(selectedElemNumber);
        _this.selectValues(dim, values, true)
      }
    }, //end of makeSelectionsOnDataPoints
    initializeArrayWithZero: function(dim1_length, dim2_unique_values, result) {
      // Initialize arrays for dimension values
       for(var i = 0; i < dim2_unique_values.length; i++) {
         // zero reset on result array
         var array_filled_with_zero = [];
         for(var j = 0; j < dim1_length; j++) {
           array_filled_with_zero[j] = 0;
         }
         result[dim2_unique_values[i]] = array_filled_with_zero;
       }
       return result;
    }, //end of initializeArrayWithZero
    storeHypercubeDataToArray: function(data_grouped_by_dim1, formatted_data_array) {
      var i = 0;
      _.each(data_grouped_by_dim1, function(d) {
          formatted_data_array["dim1"][i] = d[0].dim1;
          formatted_data_array["dim1_elem"][i] = d[0].dim1_elem;
        _.each(d, function(dd){
          formatted_data_array[dd.dim2][i] = dd.mea1;
        })
        i++;
      });
      return formatted_data_array;
    }, //end of storeHypercubeDataToArray
    flattenData: function(qMatrix) {
      // Store unique values of dim2
      var dim2_unique_values = [], dim2_unique_elem_nums = [];
      var data = qMatrix.map(function(d) {
        if(dim2_unique_values.indexOf(d[1].qText) < 0){
          dim2_unique_values.push(d[1].qText);
          dim2_unique_elem_nums[d[1].qText] = d[1].qElemNumber ;
        }
        // Return flat hypercube data
        return({
          dim1: d[0].qText,
          dim1_elem: d[0].qElemNumber,
          dim2: d[1].qText,
          mea1: d[2].qNum
        });
      })
      return [data, dim2_unique_values, dim2_unique_elem_nums]
    }, // end of flattenData
    calculateMargin: function($element, layout) {
      var ext_width = $element.width(), ext_height = $element.height();
      var margin = {top: layout.properties.marginTop, right: layout.properties.marginRight, bottom: layout.properties.marginBottom, left: layout.properties.marginLeft},
          width = ext_width - margin.left - margin.right,
          height = ext_height - margin.top - margin.bottom;
      return [width, height];

    }, // end of calculateMargin
    // pageExtensionData is based on https://github.com/skokenes/senseUtils
    pageExtensionData : function(me, $el, layout, callback) {//(this, extension DOM element, layout object from Sense, your callback)

       var lastrow = 0
       //get number of columns
       var colNums = layout.qHyperCube.qSize.qcx;
       //calculate how many rows to page. currently, you can't ask for more than 10,000 cells at a time, so the number of rows
       //needs to be 10,000 divided by number of columns
       var calcHeight = Math.floor(10000 / colNums);
       //loop through the rows we have and render
       me.backendApi.eachDataRow(function(rownum, row) {
           //simply by looping through each page, the qHyperCube is updated and will not have more than one page
           lastrow = rownum;
       });
       if (me.backendApi.getRowCount() > lastrow + 1) {//if we're not at the last row...
           //we havent got all the rows yet, so get some more.  we first create a new page request
           var requestPage = [{
               qTop : lastrow + 1,
               qLeft : 0,
               qWidth : colNums,
               //should be # of columns
               qHeight : Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
           }];
           me.backendApi.getData(requestPage).then(function(dataPages) {
               //when we get the result run the function again
               pageExtensionData(me, $el, layout, callback);
           });
       } else {//if we are at the last row...
           //fire off the callback function
           callback($el, layout, layout.qHyperCube.qDataPages[0].qMatrix, me);
           //(DOM element, layout object, new flattened matrix, this)
       }
     } // end of pageExtensionData
  };

} );
