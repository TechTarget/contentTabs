
;(function ($) {

    'use strict';

    $.fn.contentTabs = function (options) {

        var defaults = {
            tabContent: '',
            icon: true,
            callback: function () {},
            mouseEvent: 'click',
            autoPlay: false,
            autoPlaySpeed: 5000
        };
        var o = $.extend(defaults, options);

        return this.each(function () {

            var tabs = $(this).children('li');
            var tabsCount = tabs.length;
            var tabLinks = tabs.children('a');
            var tabContent = o.tabContent;
            var currentTab = 0;
            var selectedTab;
            var timer;

            // do tabby stuff
            var tabify = function (el) {

                selectTab(el);
                showContent(String(el.hash));

                // optional callback function
                o.callback.call(this);

            };

            // add 'selected' class to new tab and remove it from old tab
            var selectTab = function (el) {

                tabs.filter('.selected').removeClass('selected');
                $(el).parent('li').addClass('selected');

            };

            // if one of the tab links has a hash of 'all' then display every piece of content, otherwise display the selected tabs content
            var showContent = function (tabHash) {

                if (tabHash === '#all') {
                    tabContent.show();
                } else {
                    tabContent.hide().filter(tabHash).fadeIn('fast');
                }

            };

            // timer function for autoplay
            var autoPlayTimer = function () {
                timer = setTimeout(function () {
                    autoPlay();
                }, o.autoPlaySpeed);
            };

            // check which tab is selected and select next sibling
            var autoPlay = function () {

                if (currentTab < tabsCount - 1) {
                    currentTab++;
                } else {
                    currentTab = 0;
                }
                tabify(tabLinks.get(currentTab));
                autoPlayTimer();

            };

            // autoplay init
            if (o.autoPlay) {
                if (tabsCount > 1) {
                    autoPlayTimer();
                }
            }

            // event handler for tabs
            tabLinks.on(o.mouseEvent, function (e) {

                e.preventDefault();
                tabify(this);

                // if autoplay is enabled, restart it
                if (o.autoPlay) {
                    clearTimeout(timer);
                    autoPlayTimer();
                    currentTab = tabLinks.index(this);
                }

            });

            // add a span element if icon option set
            if (o.icon) {
                tabLinks.append('<span></span>');
            }

            // check if any of the tabs have a selected class and if so, display that tab content; otherwise select the first tab
            if (tabs.hasClass('selected')) {
                selectedTab = tabs.filter('.selected').children('a');
                currentTab = tabLinks.index(selectedTab);
                showContent(selectedTab.attr('href'));
            } else {
                tabs.first().addClass('selected');
            }

        });

    };

})(jQuery);
