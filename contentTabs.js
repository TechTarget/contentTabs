/*!
* Content Tabs v0.3 (http://okize.github.com/)
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
    displayTabs: true,
    tabLocation: 'left',
    tabActiveClass: 'active',
    panelActiveClass: 'active',
    mouseEvent: 'click'
  };

  // plugin constructor
  function Plugin( element, options ) {
    this.el = $(element);
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {

    init: function() {

      // don't display any tabs
      if (!this.options.displayTabs) {
        this.removeTabs();
        return;
      }

      // apply tab navigation position class to tabs
      var className = this.tabLocationClassName[this.options.tabLocation];
      this.el.addClass(className);

      // click event handler
      var tabs = this.getTabs();
      tabs.on('click', function(e) {
        e.preventDefault();
        Plugin.prototype.selectTab($(this).index(), tabs);
      });

    },

    tabLocationClassName: {
      left: 'tabsVerticalLeft',
      right: 'tabsVerticalRight',
      top: 'tabsHorizontalTop',
      bottom: 'tabsHorizontalBottom'
    },

    removeTabs: function() {
      this.el.addClass('tabsNone');
      $('.contentTabsNav', this.el).remove();
    },

    getTabs: function() {
      return this.el.find('.contentTabsNav').find('li');
    },

    getPanels: function() {
      return $('.contentTabsPanel', this.el);
    },

    selectTab: function(i, tabs) {
      tabs.removeClass('active');
      tabs.eq(i).addClass('active');
      this.selectPanel(i);
    },

    selectPanel: function(i) {
      var panels = this.getPanels();
      panels.hide();
      panels.eq(i).show();
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