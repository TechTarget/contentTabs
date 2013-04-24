###!
Content Tabs v1.0.4 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php
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
    maintainTabState: false # manages which tab is active through url hashes
    tabStateKey: 'ctab' # any string
    pinPanelIntro: false # will 'pin' a section of content above scrollable area
    tabLocation: 'left' # left, right, top, bottom
    tabActiveClass: 'active' # any string

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
      @activeTab = null
      @init()

    init: ->

      # don't display any tabs if disabled in options
      unless @options.displayTabs
        @removeTabs()
        return

      # will update the component state if passed via url hash
      @updateState(@activeTab) if @options.maintainTabState and @getStateFromHash()?

      # adds a class to the plugin container to allow the css to determine the
      # position (ie. top, left, etc) of the tabs relative to their panels
      @setTabsPosition @tabLocationClassName[@options.tabLocation]

      # 'pins' the first part of a panel to the top so that the overflow
      # happens on the section underneath; brittle!
      @pinPanels(@el) if @options.pinPanelIntro

      # cache tabs in var
      tabs = @getTabs()

      # apply 'active' class to first tab if there's no active class
      tabs.eq(0).addClass(@options.tabActiveClass) unless tabs.hasClass(@options.tabActiveClass)

      # apply 'last' class to last tab in collection (for IE)
      tabs.eq(tabs.length - 1).addClass('last')

      # bind click handler to tabs
      eq = undefined
      tabs.on 'click', (e) =>
        e.preventDefault()
        eq = $(e.currentTarget).index()
        @updateState(eq)

    # pass in a url or it will default to url from current window
    getArgsFromUrl: (url) ->
      url = url || window.location.href
      args = {}
      params = url.slice(url.indexOf('#') + 1).split('&')
      for item in params
        param = item.split('=')
        if param[0] is url
          return null # if there are no hashes return null
        if (param.length > 1)
          args[param[0]] = param[1]
        else
          args[param[0]] = undefined
      args

    # updates url hash with tab identifier
    updateUrlHash: (eq) ->
      window.location.hash = @options.tabStateKey + '=' + eq

    # returns number of properties of an object
    getPropertyCount: (obj) ->
      count = 0
      for key of obj
        count++ if obj.hasOwnProperty(key)
      count

    # checks if there's a hash for tab state maintenance
    # if there is, set activeTab var to hash state
    getStateFromHash: ->
      args = @getArgsFromUrl()
      return null if !args
      state = args[@options.tabStateKey] ? null
      return null if !state
      @activeTab = args[@options.tabStateKey]

    # adds class to container
    setTabsPosition: (pos) ->
      @el.addClass(pos)

    # updates the state of the component
    updateState: (eq) ->
      @activeTab = eq
      @selectTab(eq)
      @selectPanel(eq)
      return

    # returns jq collection of tab elements
    # will return from cache if called previously
    getTabs: ->
      @tabs = @el.find('.contentTabsNav').find('li') unless @tabs
      @tabs

    # 'selects' a tab by applying 'active' class to tab element
    selectTab: (eq) ->
      @updateUrlHash(eq) if (@options.maintainTabState)
      @getTabs()
        .removeClass(@options.tabActiveClass)
        .eq(eq)
        .addClass(@options.tabActiveClass)
      return

    # removes tab elements from dom
    removeTabs: ->
      @el.addClass('tabsNone')
      @getTabs().remove()

    # returns jquery collection of panel elements
    # will return from cache if called previously
    getPanels: ->
      @panels = @el.find('.contentTabsPanel') unless @panels
      @panels

    # 'selects' a panel by hiding every panel and then showing the
    # panel from panel collection that matches index
    selectPanel: (eq) ->
      @getPanels()
        .hide()
        .eq(eq)
        .show()
      return

    # adds class to container & moves .contentTabsPanelIntro divs
    # outside their respective parents in the dom
    pinPanels: ->
      sectionsToPin = undefined
      $this = undefined
      @el.addClass('pinPanelIntro')
      sectionsToPin = @el.find('.contentTabsPanelIntro')
      sectionsToPin.each ->
        $this = $(this)
        $this.insertBefore( $this.parent() )
      return

  # wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, 'plugin_#{pluginName}')
        $.data(@, 'plugin_#{pluginName}', new Plugin(@, options))
      return
  return