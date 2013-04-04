/*!
Content Tabs v1.0.3 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
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
    var Plugin, defaults, pluginName;

    pluginName = 'contentTabs';
    defaults = {
      displayTabs: true,
      pinPanelIntro: false,
      tabLocation: 'left',
      tabActiveClass: 'active',
      panelActiveClass: 'active',
      mouseEvent: 'click'
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.el = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tabs = null;
        this.panels = null;
        this.tabLocationClassName = {
          left: 'tabsVerticalLeft',
          right: 'tabsVerticalRight',
          top: 'tabsHorizontalTop',
          bottom: 'tabsHorizontalBottom'
        };
        this.init();
      }

      Plugin.prototype.init = function() {
        var eq, tabs,
          _this = this;

        if (!this.options.displayTabs) {
          this.removeTabs();
          return;
        }
        this.setTabsPosition(this.tabLocationClassName[this.options.tabLocation]);
        if (this.options.pinPanelIntro) {
          this.pinPanels(this.el);
        }
        tabs = this.getTabs();
        if (!tabs.hasClass('active')) {
          tabs.eq(0).addClass('active');
        }
        tabs.eq(tabs.length - 1).addClass('last');
        eq = void 0;
        return tabs.on('click', function(e) {
          e.preventDefault();
          eq = $(e.currentTarget).index();
          _this.selectTab(eq);
          return _this.selectPanel(eq);
        });
      };

      Plugin.prototype.setTabsPosition = function(pos) {
        return this.el.addClass(pos);
      };

      Plugin.prototype.getTabs = function() {
        if (!this.tabs) {
          this.tabs = this.el.find('.contentTabsNav').find('li');
        }
        return this.tabs;
      };

      Plugin.prototype.selectTab = function(eq) {
        return this.getTabs().removeClass('active').eq(eq).addClass('active');
      };

      Plugin.prototype.removeTabs = function() {
        this.el.addClass('tabsNone');
        return this.getTabs().remove();
      };

      Plugin.prototype.getPanels = function() {
        if (!this.panels) {
          this.panels = this.el.find('.contentTabsPanel');
        }
        return this.panels;
      };

      Plugin.prototype.selectPanel = function(eq) {
        return this.getPanels().hide().eq(eq).show();
      };

      Plugin.prototype.pinPanels = function() {
        var $this, sectionsToPin;

        sectionsToPin = void 0;
        $this = void 0;
        this.el.addClass('pinPanelIntro');
        sectionsToPin = this.el.find('.contentTabsPanelIntro');
        return sectionsToPin.each(function() {
          $this = $(this);
          return $this.insertBefore($this.parent());
        });
      };

      return Plugin;

    })();
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_#{pluginName}')) {
          $.data(this, 'plugin_#{pluginName}', new Plugin(this, options));
        }
      });
    };
  });

}).call(this);
