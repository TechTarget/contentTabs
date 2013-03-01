/*!
* Content Tabs v1.0.3 (http://okize.github.com/)
* Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
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
    this.options = $.extend( {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.tabs = false;
    this.panels = false;
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
      this.setTabLocation( this.tabLocationClassName[this.options.tabLocation] );

      // pinning is like winning
      if (this.options.pinPanelIntro) {
        this.pinPanels(this.el);
      }

      // init tabs
      var tabs = this.getTabs();

      // apply 'active' class to first tab if there's no active class
      if (!tabs.hasClass('active')) {
        tabs.eq(0).addClass('active');
      }

      // apply 'last' class to last tab in collection
      tabs.eq( tabs.length - 1 ).addClass('last');

      // bind click event handler
      var self = this, eq;
      tabs.on('click', function (e) {
        e.preventDefault();
        eq = $(this).index();
        self.selectTab(eq);
        self.selectPanel(eq);
      });

    },

    tabLocationClassName: {
      left: 'tabsVerticalLeft',
      right: 'tabsVerticalRight',
      top: 'tabsHorizontalTop',
      bottom: 'tabsHorizontalBottom'
    },

    setTabLocation: function (pos) {
      this.el.addClass(pos);
    },

    getTabs: function () {
      // cache tabs collection
      if (!this.tabs) {
        this.tabs = this.el.find('.contentTabsNav').find('li');
      }
      return this.tabs;
    },

    selectTab: function (eq) {
      this.getTabs().removeClass('active').eq(eq).addClass('active');
    },

    removeTabs: function () {
      this.el.addClass('tabsNone');
      this.getTabs().remove();
    },

    getPanels: function () {
      // cache panels collection
      if (!this.panels) {
        this.panels = this.el.find('.contentTabsPanel');
      }
      return this.panels;
    },

    selectPanel: function (eq) {
      this.getPanels().hide().eq(eq).show();
    },

    pinPanels: function () {

      var sectionsToPin, $this;

      // add class if we want the panel intro to be 'pinned'
      this.el.addClass('pinPanelIntro');

      // move contentTabsPanelIntro divs outside their parent in the dom
      sectionsToPin = this.el.find('.contentTabsPanelIntro');
      sectionsToPin.each( function () {
        $this = $(this);
        $this.insertBefore( $this.parent() );
      });

    }

  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin( this, options ));
      }
    });
  };

}));