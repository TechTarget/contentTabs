/*!
* Content Tabs v0.2 (http://okize.github.com/)
* Copyright (c) 2012 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
*/

// use AMD or browser globals to create a jQuery plugin.
;(function (factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }

}(function ($) {

  'use strict';

  // defaults
  var pluginName = 'contentTabs';
  var defaults = {
    tabActiveClass: 'active',
    panelActiveClass: 'active',
    mouseEvent: 'click'
  };

  // plugin constructor
  function Plugin( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {

    getTabs: function() {
      return $('.contentTabsNav', Plugin.prototype.element).find('li');
    },

    getPanels: function() {
      return $('.contentTabsPanel', Plugin.prototype.element);
    },

    selectTab: function(i, tabs) {
      tabs.removeClass('active');
      tabs.eq(i).addClass('active');
      Plugin.prototype.selectPanel(i);
    },

    selectPanel: function(i) {
      var panels = this.getPanels();
      panels.hide();
      panels.eq(i).show();
    },

    init: function() {
      var tabs = this.getTabs();
      tabs.on('click', function(e) {
        e.preventDefault();
        Plugin.prototype.selectTab($(this).index(), tabs);
      });
    }

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin( this, options ));
      }
    });
  };

}));