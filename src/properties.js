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
              ShowAsDoughnutChart: {
                label: "Show As Doughnut Chart",
                component: "switch",
                ref: "pie_doughnut",
                type: "string",
                options: [{
                  value: "doughnut",
                  label: "ON"
                }, {
                  value: "pie",
                  label: "OFF"
                }],
                defaultValue: "pie",
                show: function(data) { return data.chart == '8'}
              },
              Colors: {
                label: "Colors",
                component: "switch",
                ref: "colors",
                type: "string",
                options: [{
                  value: "auto",
                  label: "Auto"
                }, {
                  value: "custom",
                  label: "Custom"
                }],
                defaultValue: "auto"
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
                show: function(data) { return data.colors == 'auto' && (data.chart == '2' || data.chart == '4'  || data.chart == '6' || data.chart == '7' || data.chart == '8' || data.chart == '9') }
              },
              ColorPicker: {
                label:"Color",
                component: "color-picker",
                ref: "color",
                type: "integer",
                defaultValue: 3,
                show: function(data) { return data.colors == 'auto' && (data.chart == '1' || data.chart == '3' || data.chart == '5'  || data.chart == '10') }
              },
              CustomColors: {
                ref: "custom_colors",
                label: "Custom Colors",
                type: "string",
                defaultValue: "51,34,136 - 102,153,204 - 136,204,238 - 68,170,153 - 17,119,51 - 153,153,51 - 221,204,119 - 102,17,0 - 204,102,119 - 170,68,102 - 136,34,85 - 170,68,153",
                show: function(data) { return data.colors == 'custom'}
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
                show: function(data) { return data.chart == '3' || data.chart == '4' || data.chart == '5' || data.chart == '6' || data.chart == '9'}
              },
              BackgroundColor: {
                label:"Background Color",
                component: "color-picker",
                ref: "background_color",
                type: "integer",
                defaultValue: 3,
                show: function(data) { return ( data.colors == 'auto' && data.background_color_switch == true && ( data.chart == '3' || data.chart == '5' ))}
              },
              CustomBackgroundColor: {
                ref: "custom_background_color",
                label: "Custom Background Color",
                type: "string",
                defaultValue: "51,34,136 - 102,153,204 - 136,204,238 - 68,170,153 - 17,119,51 - 153,153,51 - 221,204,119 - 102,17,0 - 204,102,119 - 170,68,102 - 136,34,85 - 170,68,153",
                show: function(data) { return ( data.colors == 'custom' && data.background_color_switch == true && ( data.chart == '3' || data.chart == '5' ))}
              },
              ColorOpacity: {
                  type: "number",
                  component: "slider",
                  label: "Color Opacity",
                  ref: "opacity",
                  min: 0,
                  max: 1,
                  step: 0.1,
                  defaultValue: 0.8
              },
              BubbleSize: {
                  type: "number",
                  component: "slider",
                  label: "Bubble Size",
                  ref: "bubble_size",
                  min: 1,
                  max: 50,
                  step: 1,
                  defaultValue: 2,
                  show: function(data) { return data.chart == '10'}
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
                show: function(data) { return data.chart == '2' || data.chart == '4'  || data.chart == '6'  || data.chart == '9'}
              },
              PointRadiusSize: {
                type: "number",
                component: "slider",
                label: "Point Raduis Size",
                ref: "point_radius_size",
                min: 1,
                max: 20,
                step: 1,
                defaultValue: 2,
                show: function(data) { return data.chart == '3' || data.chart == '4' || data.chart == '5'  || data.chart == '6' || data.chart == '9'}
              },
              marginTop: {
                ref: "properties.marginTop",
                label: "Margin Top (px)",
                type: "integer",
                defaultValue: 20,
                show: false
              },
              marginRight: {
                ref: "properties.marginRight",
                label: "Margin Right (px)",
                type: "integer",
                defaultValue: 20,
                show: false
              },
              marginBottom: {
                ref: "properties.marginBottom",
                label: "Margin Bottom (px)",
                type: "integer",
                defaultValue: 30
              },
              marginLeft: {
                ref: "properties.marginLeft",
                label: "Margin Left (px)",
                type: "integer",
                defaultValue: 40,
                show: false
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
                defaultValue: false,
                show: function(data) { return data.chart != '10'}
              },
              // CumulativeLine: {
              //   type: "boolean",
              //   component: "switch",
              //   label: "Show Cumulative Line",
              //   ref: "cumulative_line",
              //   options: [{
              //     value: true,
              //     label: "ON"
              //   }, {
              //     value: false,
              //     label: "OFF"
              //   }],
              //   defaultValue: false,
              //   show: false
              // },
              LegendPotision: {
                type: "string",
                component: "dropdown",
                label: "Legend Position",
                ref: "legend_position",
                options: [{
                  value: "top",
                  label: "Top"
                }, {
                  value: "bottom",
                  label: "Bottom"
                },{
                  value: "right",
                  label: "Right"
                }, {
                  value: "left",
                  label: "Left"
                }, {
                  value: "hide",
                  label: "Hide"
                }],
                defaultValue: "top"
              },
              DataLabelSwitch: {
                type: "boolean",
                component: "switch",
                label: "Show Data Label",
                ref: "datalabel_switch",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: false,
                show: function(data) { return data.chart == '1' || data.chart == '2' || data.chart == '3' || data.chart == '4' || data.chart == '9'  || data.chart == '10'}
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
              },
              beginAtZero: {
                type: "boolean",
                component: "switch",
                label: "Begin At Zero",
                ref: "begin_at_zero_switch",
                options: [{
                  value: true,
                  label: "ON"
                }, {
                  value: false,
                  label: "OFF"
                }],
                defaultValue: true
              },
              XScaleMode: {
                type: "string",
                component: "dropdown",
                label: "XScaleMode",
                ref: "xscale_mode",
                options: [{
                  value: "category",
                  label: "Category"
                }, {
                  value: "linear",
                  label: "Linear"
                }],
                defaultValue: "linear",
                show: function(data) { return data.chart == '3' || data.chart == '10' }
              },
              DecimalSeparator: {
                type: "string",
                component: "dropdown",
                label: "Decimal Separator",
                ref: "decimal_separator",
                options: [{
                  value: ".",
                  label: "."
                }, {
                  value: ",",
                  label: ","
                }],
                defaultValue: "."
              },
              ThousandSeparator: {
                type: "string",
                component: "dropdown",
                label: "Thousand Separator",
                ref: "thousand_separator",
                options: [{
                  value: ",",
                  label: ","
                }, {
                  value: ".",
                  label: "."
                }, {
                  value: " ",
                  label: "Space"
                }],
                defaultValue: ","
              },
              LineWidth: {
                  type: "number",
                  component: "slider",
                  label: "Line Width",
                  ref: "line_width",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 2,
                  show: function(data) { return (data.chart == '3' || data.chart == '10') }
              },
              LineColors: {
                label: "Line Colors",
                component: "switch",
                ref: "line_color_switch",
                type: "string",
                options: [{
                  value: "auto",
                  label: "Auto"
                }, {
                  value: "custom",
                  label: "Custom"
                }],
                defaultValue: "auto",
                show: function(data) { return (data.chart == '3' || data.chart == '10') }
              },
              LineColorSelection: {
                type: "string",
                component: "dropdown",
                //label: "Color Selection",
                ref: "line_color_selection",
                options: [{
                  value: "single",
                  label: "Single Color"
                }, {
                  value: "measure",
                  label: "By Measure"
                }],
                defaultValue: "single",
                show: function(data) { return data.line_color_switch == 'custom' && (data.chart == '3' || data.chart == '10') }
              },
              LineColorPicker: {
                label:"Line Color",
                component: "color-picker",
                ref: "line_color_picker",
                type: "integer",
                defaultValue: 7,
                show: function(data) { return data.line_color_switch == 'custom' && data.line_color_selection == 'single' && (data.chart == '3' || data.chart == '10') }
              },
              LineColorSelectionForMeasure: {
                type: "string",
                component: "dropdown",
                label: "Color Selection",
                ref: "line_color_selection_for_measure",
                options: [{
                  value: "twelve",
                  label: "12 Colors"
                }, {
                  value: "one-handred",
                  label: "100 Colors"
                }],
                defaultValue: "twelve",
                show: function(data) { return data.line_color_switch == 'custom' && data.line_color_selection == 'measure' && (data.chart == '3' || data.chart == '10') }
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
