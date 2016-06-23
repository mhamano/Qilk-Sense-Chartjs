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
            label: "Chart Selection",
            ref: "chart",
            options: chart_options,
            defaultValue: 1
          },
          ChartSettings: {
          	type: "items",
          	label: "Chart Settings",
            items: {
              ColorPicker: {
                label:"Color",
                component: "color-picker",
                ref: "color",
                type: "integer",
                defaultValue: 3,
                show: function(data) { return data.chart == '1' || data.chart == '3' || data.chart == '5'}
              },
              BackgroundColorSwitch: {
                label: "Fill Background Color",
                component: "switch",
                ref: "background_color_switch",
                type: "boolean",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: false,
                show: function(data) { return data.chart == '3' || data.chart == '4' || data.chart == '5' || data.chart == '6'}
              },
              BackgroundColor: {
                label:"Background Color",
                component: "color-picker",
                ref: "background_color",
                type: "integer",
                defaultValue: 3,
                show: function(data) { return ( data.background_color_switch == true && data.chart == '3' ) || ( data.background_color_switch == true && data.chart == '5' )}
              },
              ColorSelection: {
                type: "string",
                component: "dropdown",
                label: "Color Selection",
                ref: "color_selection",
                options: [{
                  value: "twelve",
                  label: "12 Colors"
                }, {
                  value: "one-handred",
                  label: "100 Colors"
                }],
                defaultValue: "twelve",
                show: function(data) { return data.chart == '2' || data.chart == '4'  || data.chart == '6' || data.chart == '7' || data.chart == '8'}
              },
              ColorOpacity: {
                  type: "number",
                  component: "slider",
                  label: "Color Opacity",
                  ref: "opacity",
                  min: 0,
                  max: 1,
                  step: 0.1,
                  defaultValue: 0.8,
                  show: function(data) { return data.chart == '3' || data.chart == '4' || data.chart == '5'  || data.chart == '6'}
              },
              SortByAlphabet: {
                label:"Sort by Alphabetic Order on 2nd Dim",
                component: "switch",
                ref: "sort",
                type: "boolean",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: false,
                show: function(data) { return data.chart == '2' || data.chart == '4'  || data.chart == '6' }
              },
              PointRadiusSize: {
      						type: "number",
      						component: "slider",
      						label: "Point Raduis Size",
      						ref: "point_radius_size",
      						min: 1,
      						max: 20,
      						step: 1,
      						defaultValue: 1,
                  show: function(data) { return data.chart == '3' || data.chart == '4' || data.chart == '5'  || data.chart == '6'}
              },
              CumulativeSwitch: {
                type: "boolean",
                component: "switch",
                label: "Cumulative Calculation",
                ref: "cumulative",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: false
              },
              TitleSwitch: {
                type: "boolean",
                component: "switch",
                label: "Show Title",
                ref: "title_switch",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: false
              }
          }
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
