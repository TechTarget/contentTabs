###!
Content Tabs v1.0.3 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
###

((factory) ->

  # use AMD or browser globals to create a jQuery plugin.
  if typeof define is 'function' and define.amd
    define [ 'jquery' ], factory
  else
    factory jQuery

) ($) ->

  'use strict'

  pluginName = 'contentTabs'

  # default plugin options
  defaults =
    displayTabs: true
    pinPanelIntro: false
    tabLocation: 'left'
    tabActiveClass: 'active'
    panelActiveClass: 'active'
    mouseEvent: 'click'

  # plugin constructor
  class Plugin

    constructor: (@element, options) ->
      @el = $(@element)
      @options = $.extend({}, defaults, options)
      @_defaults = defaults
      @_name = pluginName
      @tabs = null
      @panels = null
      @tabLocationClassName =
        left: 'tabsVerticalLeft'
        right: 'tabsVerticalRight'
        top: 'tabsHorizontalTop'
        bottom: 'tabsHorizontalBottom'
      @init()

    init: ->

      # don't display any tabs if disabled in options
      unless @options.displayTabs
        @removeTabs()
        return

      # adds a class to the plugin container to allow the css to determine the
      # poition (ie. top, left, etc) of the tabs relative to their panels
      @setTabsPosition @tabLocationClassName[@options.tabLocation]

      # 'pins' the first part of a panel to the top so that the overflow
      # happens on the section underneath; brittle!
      @pinPanels @el  if @options.pinPanelIntro

      # cache tabs in var
      tabs = @getTabs()

      # apply 'active' class to first tab if there's no active class
      tabs.eq(0).addClass 'active'  unless tabs.hasClass('active')

      # apply 'last' class to last tab in collection (for IE)
      tabs.eq(tabs.length - 1).addClass 'last'

      # bind click handler to tabs
      self = this
      eq = undefined
      tabs.on 'click', (e) ->
        e.preventDefault()
        eq = $(this).index()
        self.selectTab eq
        self.selectPanel eq

    # adds class to container
    setTabsPosition: (pos) ->
      @el.addClass pos

    # returns jq collection of tab elements
    # will return from cache if called previously
    getTabs: ->
      @tabs = @el.find('.contentTabsNav').find('li') unless @tabs
      @tabs

    # 'selects' a tab by applying 'active' class to tab element
    selectTab: (eq) ->
      @getTabs().removeClass('active').eq(eq).addClass 'active'

    # removes tab elements from dom
    removeTabs: ->
      @el.addClass 'tabsNone'
      @getTabs().remove()

    # returns jq collection of panel elements
    # will return from cache if called previously
    getPanels: ->
      @panels = @el.find('.contentTabsPanel')  unless @panels
      @panels

    # 'selects' a panel by hiding every panel and then showing the
    # panel from panel collection that matches index
    selectPanel: (eq) ->
      @getPanels().hide().eq(eq).show()

    # adds class to container & moves .contentTabsPanelIntro divs
    # outside their respective parents in the dom
    pinPanels: ->
      sectionsToPin = undefined
      $this = undefined
      @el.addClass 'pinPanelIntro'
      sectionsToPin = @el.find('.contentTabsPanelIntro')
      sectionsToPin.each ->
        $this = $(this)
        $this.insertBefore $this.parent()

  # lightweight wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, 'plugin_#{pluginName}')
        $.data(@, 'plugin_#{pluginName}', new Plugin(@, options))
      return
  return