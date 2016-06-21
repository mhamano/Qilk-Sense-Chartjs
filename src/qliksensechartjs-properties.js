/*global define*/
define([
  './lib/js/contents'

], function ( contents ) {
  'use strict';

    var dimensions = {
        uses: "dimensions",
        min: 0
    };

    var measures = {
        uses: "measures",
        min: 0
    };

    var sorting = {
        uses: "sorting"
    };

    var settings = {
        uses: "settings",
        items: {
          ChartDropDown: {
            type: "string",
            component: "dropdown",
            label: "Chart",
            ref: "chart",
            options: content_options,
            defaultValue: 1
          },
          ColorPicker: {
							label:"Color",
							component: "color-picker",
							ref: "color",
							type: "integer",
							defaultValue: 3
					},
          CumulativeSwitch: {
          type: "boolean",
          component: "switch",
          label: "Cumulative",
          ref: "cumulative",
          options: [{
            value: true,
            label: "On"
          }, {
            value: false,
            label: "Not On"
          }],
          defaultValue: false
        }
        }
    };


    // Return values
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            sorting: sorting,
            //addons: addons,
            settings: settings

        }
    };

});
