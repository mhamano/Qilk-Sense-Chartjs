/*global
            define,
            require,
            window,
            console,
            _
*/
/*jslint    devel:true,
            white: true
 */
define([
        'jquery',
        'underscore',
        './properties',
        './initialproperties',
        './lib/js/extensionUtils',
        './lib/js/chartjsUtils',
        'text!./lib/css/style.css',
        './lib/js/contents',
        './lib/js/Chart'
],
function ($, _, props, initProps, extensionUtils, chartjsUtils, cssContent, contents, Chart) {
    'use strict';
    extensionUtils.addStyleToHeader(cssContent);

    //Accessing requirejs semi-private API - This might break in future versions of require.
    var base = requirejs.s.contexts._.config.baseUrl + requirejs.s.contexts._.config.paths.extensions
    //var lastUsedChart = -1;

    return {
        definition: props,
        initialProperties: initProps,
        support: {
		        snapshot: true,
		        export: true,
		        exportData: true
	      },
        //snapshot: { canTakeSnapshot: true },
        //
        // resize : function($el, layout) {
        //     this.paint($el,layout);
        // },

//        clearSelectedValues : function($element) {
//
//        },


        // Angular Template
        //template: '',
        // (Angular Template)

        // Angular Controller
        controller: ['$scope', function ($scope) {

        }],
        // (Angular Controller)


        // Paint Method
        paint: function ($element, layout) {

            var self = this;

    				var dim_count = layout.qHyperCube.qDimensionInfo.length;
    				var measure_count = layout.qHyperCube.qMeasureInfo.length;

    				if ((dim_count < chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims || dim_count > chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].max_dims) || measure_count < chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures) {
    					$element.html("This chart requires " + chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims + " dimensions and " + chartjs.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures + " measures.");
    				} else {

              //if (layout.chart != lastUsedChart) {
    						// Determine URL based on chart selection
    						var src = chartjs.filter(function(d) {
    							return d.id === layout.chart
    						})[0].src;

    						var url = base + "/qlik-sense-chartjs/lib/js/" + src;

    						// Load in the appropriate script and viz
    						jQuery.getScript(url, function() {
    							visualize($element, layout, self, chartjsUtils);
    							//lastUsedChart = layout.chart;
    						});
    					//} else {
    					//	viz($element, layout, self);
    					//}

            }
        }
        // (Paint Method)
    };

});
