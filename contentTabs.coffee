###!
Content Tabs v1.0.6 (http://okize.github.com/)
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
    tabLocation: 'left' # left, right, top, bottom
    tabActiveClass: 'active' # any string
    maintainState: false # manages which tab is active through url hashes
    indexOfOpenPanel: 0 # can set a default tab/panel to be open
    pinPanelIntro: false # will 'pin' a section of content above scrollable area
    pinnedPanelLocation: 'top' # left, top

  class Tabs

    # plugin constructor
    constructor: (@element, options) ->

      @el = $(@element)
      @options = $.extend({}, defaults, options)
      @_defaults = defaults
      @_name = pluginName
      @tabs = null
      @panels = null
      @tabLocationClassMap =
        top: 'tabsHorizontalTop'
        bottom: 'tabsHorizontalBottom'
        left: 'tabsVerticalLeft'
        right: 'tabsVerticalRight'
      @pinnedPanelLocationClassMap =
        top: 'pinnedPanelTop'
        left: 'pinnedPanelLeft'
      @activeTab = @options.indexOfOpenPanel
      @stateKey = 'tabState'
      @hashObject = null
      @init()

    # plugin initializer
    init: ->

      # don't display any tabs if disabled in options
      unless @options.displayTabs
        @removeTabs()
        return

      # will update the component state if passed via url hash
      @updateState(@activeTab) if @options.maintainState and @getStateFromHash()?

      # adds a class to the plugin container to allow the css to determine the
      # position (ie. top, left, etc) of the tabs relative to their panels
      @setTabsPosition @tabLocationClassMap[@options.tabLocation]

      # 'pins' the first part of a panel to the top so that the overflow
      # happens on the section underneath; brittle!
      @pinPanels(@el) if @options.pinPanelIntro

      # cache tabs in var
      tabs = @getTabs()

      # apply 'active' class to first tab if there's no active class
      tabs.eq(@activeTab).addClass(@options.tabActiveClass) unless tabs.hasClass(@options.tabActiveClass)

      # apply 'last' class to last tab in collection (for IE)
      tabs.eq(tabs.length - 1).addClass('last')

      # bind click handler to tabs
      tabs.on 'click', (e) =>
        e.preventDefault()
        @updateState( $(e.currentTarget).index() )

    # checks if there's a hash for tab state maintenance
    # if there is, set activeTab var to hash state
    getStateFromHash: ->

      @hashObject = @getHashObject()
      return null if !@hashObject
      state = @hashObject[@stateKey] ? null
      return null if !state
      @activeTab = @hashObject[@stateKey]

    # returns null if no hashes, otherwise returns object created from hash
    getHashObject: ->

      hash = @getUrlHash()
      return null if !hash
      args = {}
      arr = hash.split('&')
      for item in arr
        arg = item.split('=')
        if (arg.length > 1)
          args[arg[0]] = arg[1]
        else
          args[arg[0]] = undefined
      args

    # converts the hash object into a string for the url hash
    buildHashObject: () ->

      $.param(@hashObject)

    # updates the cached hash object and then updates url
    updateHash: (eq) ->

      # convert to string
      eq += ''

      # get fresh hash obj in case another component has altered it
      @hashObject = @getHashObject()

      # if @hashObject is null, create it
      @hashObject = {} if !@hashObject

      # update hash
      @hashObject[@stateKey] = eq
      @setUrlHash(@buildHashObject())

    # returns the hash from the current window or null
    getUrlHash: ->

      if window.location.hash then window.location.hash.substring(1) else null

    # updates url hash with tab identifier
    setUrlHash: (hash) ->

      window.location.hash = hash

    # updates the state of the component
    updateState: (eq) ->

      @activeTab = eq
      @selectTab(eq)
      @selectPanel(eq)

    # removes tab elements from dom
    removeTabs: ->

      @el.addClass('tabsNone')
      @getTabs().remove()

    # adds class to container
    setTabsPosition: (pos) ->

      @el.addClass(pos)

    # returns jq collection of tab elements
    # will return from cache if called previously
    getTabs: ->

      @tabs = @el.find('.contentTabsNav').find('li') unless @tabs
      @tabs

    # 'selects' a tab by applying 'active' class to tab element
    selectTab: (eq) ->

      @updateHash(eq) if (@options.maintainState)
      @getTabs()
        .removeClass(@options.tabActiveClass)
        .eq(eq)
        .addClass(@options.tabActiveClass)

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

    # adds class to container & moves .contentTabsPanelIntro divs
    # outside their respective parents in the dom
    pinPanels: ->

      sectionsToPin = undefined
      $this = undefined

      # add classes for positioning
      @el
        .addClass('pinPanelIntro')
        .addClass(@pinnedPanelLocationClassMap[@options.pinnedPanelLocation])

      sectionsToPin = @el.find('.contentTabsPanelIntro')
      sectionsToPin.each ->
        $this = $(this)
        $this.insertBefore( $this.parent() )

  # wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, 'plugin_#{pluginName}')
        $.data(@, 'plugin_#{pluginName}', new Tabs(@, options))
      return
  return