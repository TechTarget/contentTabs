/*!
Content Tabs v1.0.5 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php
*/


(function() {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery'], factory);
    } else {
      return factory(jQuery);
    }
  })(function($) {
    'use strict';
    var Tabs, defaults, pluginName;

    pluginName = 'contentTabs';
    defaults = {
      displayTabs: true,
      tabLocation: 'left',
      tabActiveClass: 'active',
      maintainState: false,
      indexOfOpenPanel: 0,
      pinPanelIntro: false,
      pinnedPanelLocation: 'top'
    };
    Tabs = (function() {
      function Tabs(element, options) {
        this.element = element;
        this.el = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tabs = null;
        this.panels = null;
        this.tabLocationClassMap = {
          top: 'tabsHorizontalTop',
          bottom: 'tabsHorizontalBottom',
          left: 'tabsVerticalLeft',
          right: 'tabsVerticalRight'
        };
        this.pinnedPanelLocationClassMap = {
          top: 'pinnedPanelTop',
          left: 'pinnedPanelLeft'
        };
        this.activeTab = this.options.indexOfOpenPanel;
        this.stateKey = 'tabState';
        this.hashObject = null;
        this.init();
      }

      Tabs.prototype.init = function() {
        var tabs,
          _this = this;

        console.log(this.options.pinnedPanelLocation);
        if (!this.options.displayTabs) {
          this.removeTabs();
          return;
        }
        if (this.options.maintainState && (this.getStateFromHash() != null)) {
          this.updateState(this.activeTab);
        }
        this.setTabsPosition(this.tabLocationClassMap[this.options.tabLocation]);
        if (this.options.pinPanelIntro) {
          this.pinPanels(this.el);
        }
        tabs = this.getTabs();
        if (!tabs.hasClass(this.options.tabActiveClass)) {
          tabs.eq(this.activeTab).addClass(this.options.tabActiveClass);
        }
        tabs.eq(tabs.length - 1).addClass('last');
        return tabs.on('click', function(e) {
          e.preventDefault();
          return _this.updateState($(e.currentTarget).index());
        });
      };

      Tabs.prototype.getStateFromHash = function() {
        var state, _ref;

        this.hashObject = this.getHashObject();
        if (!this.hashObject) {
          return null;
        }
        state = (_ref = this.hashObject[this.stateKey]) != null ? _ref : null;
        if (!state) {
          return null;
        }
        return this.activeTab = this.hashObject[this.stateKey];
      };

      Tabs.prototype.getHashObject = function() {
        var arg, args, arr, hash, item, _i, _len;

        hash = this.getUrlHash();
        if (!hash) {
          return null;
        }
        args = {};
        arr = hash.split('&');
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          item = arr[_i];
          arg = item.split('=');
          if (arg.length > 1) {
            args[arg[0]] = arg[1];
          } else {
            args[arg[0]] = void 0;
          }
        }
        return args;
      };

      Tabs.prototype.buildHashObject = function() {
        return $.param(this.hashObject);
      };

      Tabs.prototype.updateHash = function(eq) {
        eq += '';
        this.hashObject = this.getHashObject();
        if (!this.hashObject) {
          this.hashObject = {};
        }
        this.hashObject[this.stateKey] = eq;
        return this.setUrlHash(this.buildHashObject());
      };

      Tabs.prototype.getUrlHash = function() {
        if (window.location.hash) {
          return window.location.hash.substring(1);
        } else {
          return null;
        }
      };

      Tabs.prototype.setUrlHash = function(hash) {
        return window.location.hash = hash;
      };

      Tabs.prototype.updateState = function(eq) {
        this.activeTab = eq;
        this.selectTab(eq);
        return this.selectPanel(eq);
      };

      Tabs.prototype.removeTabs = function() {
        this.el.addClass('tabsNone');
        return this.getTabs().remove();
      };

      Tabs.prototype.setTabsPosition = function(pos) {
        return this.el.addClass(pos);
      };

      Tabs.prototype.getTabs = function() {
        if (!this.tabs) {
          this.tabs = this.el.find('.contentTabsNav').find('li');
        }
        return this.tabs;
      };

      Tabs.prototype.selectTab = function(eq) {
        if (this.options.maintainState) {
          this.updateHash(eq);
        }
        return this.getTabs().removeClass(this.options.tabActiveClass).eq(eq).addClass(this.options.tabActiveClass);
      };

      Tabs.prototype.getPanels = function() {
        if (!this.panels) {
          this.panels = this.el.find('.contentTabsPanel');
        }
        return this.panels;
      };

      Tabs.prototype.selectPanel = function(eq) {
        return this.getPanels().hide().eq(eq).show();
      };

      Tabs.prototype.pinPanels = function() {
        var $this, sectionsToPin;

        sectionsToPin = void 0;
        $this = void 0;
        this.el.addClass('pinPanelIntro').addClass(this.pinnedPanelLocationClassMap[this.options.pinnedPanelLocation]);
        sectionsToPin = this.el.find('.contentTabsPanelIntro');
        return sectionsToPin.each(function() {
          $this = $(this);
          return $this.insertBefore($this.parent());
        });
      };

      return Tabs;

    })();
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_#{pluginName}')) {
          $.data(this, 'plugin_#{pluginName}', new Tabs(this, options));
        }
      });
    };
  });

}).call(this);
