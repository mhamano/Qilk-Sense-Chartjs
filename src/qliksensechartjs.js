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
        './qliksensechartjs-properties',
        './qliksensechartjs-initialproperties',
        './lib/js/extensionUtils',
        'text!./lib/css/style.css',
        './lib/js/contents',
        './lib/js/Chart'
],
function ($, _, props, initProps, extensionUtils, cssContent, contents, Chart) {
    'use strict';
    extensionUtils.addStyleToHeader(cssContent);

    //Accessing requirejs semi-private API - This might break in future versions of require.
    var base = requirejs.s.contexts._.config.baseUrl + requirejs.s.contexts._.config.paths.extensions
    var lastUsedChart = -1;

    return {
        definition: props,
        initialProperties: initProps,
        snapshot: { canTakeSnapshot: true },
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

    				if ((dim_count < charts.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims || dim_count > charts.filter(function(d) {
    						return d.id === layout.chart
    					})[0].max_dims) || measure_count < charts.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures) {
    					$element.html("This chart requires " + charts.filter(function(d) {
    						return d.id === layout.chart
    					})[0].min_dims + " dimensions and " + charts.filter(function(d) {
    						return d.id === layout.chart
    					})[0].measures + " measures.");
    				} else {

              //if (layout.chart != lastUsedChart) {
    						// Determine URL based on chart selection
    						var src = charts.filter(function(d) {
    							return d.id === layout.chart
    						})[0].src;

    						var url = base + "/qliksensechartjs/lib/js/" + src;

    						// Load in the appropriate script and viz
    						jQuery.getScript(url, function() {
    							visualize($element, layout, self);
    							lastUsedChart = layout.chart;
    						});
    					//} else {
    					//	viz($element, layout, self);
    					//}

            }
        }
        // (Paint Method)
    };

});
