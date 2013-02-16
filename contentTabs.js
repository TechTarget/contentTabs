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
    pinPanelIntro: false,
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

    init: function () {

      // don't display any tabs
      if (!this.options.displayTabs) {
        this.removeTabs();
        return;
      }

      // apply tab navigation position class to tabs
      this.setTabPosition( this.tabLocationClassName[this.options.tabLocation] );

      // add class if we want the panel intro to be 'pinned'
      if (this.options.pinPanelIntro) {
        this.el.addClass('pinPanelIntro');
      }

      // init tabs
      this.getTabs();

    },

    tabLocationClassName: {
      left: 'tabsVerticalLeft',
      right: 'tabsVerticalRight',
      top: 'tabsHorizontalTop',
      bottom: 'tabsHorizontalBottom'
    },

    removeTabs: function () {
      this.el.addClass('tabsNone');
      this.getTabs().remove();
    },

    setTabPosition: function (pos) {
      this.el.addClass(pos);
    },

    getTabs: function () {

      var self = this,
          tabs = self.el.find('.contentTabsNav').find('li');

      // apply active class to first tab if there's no active class
      if (!tabs.hasClass('active')) {
        tabs.eq(0).addClass('active');
      }

      // bind click event handler
      tabs.on('click', function (e) {
        e.preventDefault();
        self.selectTab($(this).index(), tabs);
      });

      return tabs;

    },

    getPanels: function () {
      return this.el.find('.contentTabsPanel');
    },

    selectTab: function (eq, tabs) {
      tabs.removeClass('active');
      tabs.eq(eq).addClass('active');
      this.selectPanel(eq);
    },

    selectPanel: function (eq) {
      var panels = this.getPanels();
      panels.hide();
      panels.eq(eq).show();
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