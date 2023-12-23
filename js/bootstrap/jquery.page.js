/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */

// Utility
if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document, undefined) {
    "use strict";

    var sectionNav = {

        init: function(options, container) {

            this.options = $.extend({}, $.fn.sectionNav.defaults, options);

            this.container = container;
            this.$container = $(container);
            this.$links = this.$container.find('a');

            if (this.options.filter !== '') {
                this.$links = this.$links.filter(this.options.filter);
            }

            this.$window = $(window);
            this.$htmlbody = $('html, body');

            this.$links.on('click.sectionNav', $.proxy(this.handleClick, this));

            this.didScroll = false;
            this.checkPosition();
            this.setTimer();
        },

        handleClick: function(e) {
            var self  = this,
                link  = e.currentTarget,
                $elem = $(link.hash);

            e.preventDefault();

            if ($elem.length) { // Make sure the target elem exists

                // Prevent active link from cycling during the scroll
                self.clearTimer();

                // Before scrolling starts
                if (typeof self.options.beforeStart === 'function') {
                    self.options.beforeStart();
                }

                self.setActiveLink(link.hash);

                self.scrollTo($elem, function() {

                    if (self.options.updateHash && history.pushState) {
                        history.pushState(null,null, link.hash);
                    }

                    self.setTimer();

                    // After scrolling ends
                    if (typeof self.options.onComplete === 'function') {
                        self.options.onComplete();
                    }
                });
            }
        },

        scrollTo: function($elem, callback) {
            var self = this;
            var target = self.getCoords($elem).top;
            var called = false;

            self.$htmlbody.stop().animate(
                {scrollTop: target},
                {
                    duration: self.options.speed,
                    easing: self.options.easing,
                    complete: function() {
                        if (typeof callback === 'function' && !called) {
                            callback();
                        }
                        called = true;
                    }
                }
            );
        },

        setTimer: function() {
            var self = this;

            self.$window.on('scroll.sectionNav', function() {
                self.didScroll = true;
            });

            self.timer = setInterval(function() {
                if (self.didScroll) {
                    self.didScroll = false;
                    self.checkPosition();
                }
            }, 250);
        },

        clearTimer: function() {
            clearInterval(this.timer);
            this.$window.off('scroll.sectionNav');
            this.didScroll = false;
        },

        // Check the scroll position and set the active section
        checkPosition: function() {
            var scrollPos = this.$window.scrollTop();
            var currentSection = this.getCurrentSection(scrollPos);
            if(currentSection!==null) {
                this.setActiveLink(currentSection);
            }
        },

        getCoords: function($elem) {
            return {
                top: Math.round($elem.offset().top) - this.options.offset
            };
        },

        setActiveLink: function(href) {
            var $activeLink = this.$container.find("a[href$='" + href + "']");

            if (!$activeLink.hasClass(this.options.currentClass)) {
                this.$links.removeClass(this.options.currentClass);
                $activeLink.addClass(this.options.currentClass);
            }
        },

        getCurrentSection: function(scrollPos) {
            var i, hash, coords, section;

            for (i = 0; i < this.$links.length; i++) {
                hash = this.$links[i].hash;

                if ($(hash).length) {
                    coords = this.getCoords($(hash));

                    if (scrollPos >= coords.top - this.options.threshold) {
                        section = hash;
                    }
                }
            }

            // The current section or the first link if it is found
            return section || ((this.$links.length===0) ? (null) : (this.$links[0].hash));
        }
    };

    $.fn.sectionNav = function(options) {
        return this.each(function() {
            var sectionNav = Object.create(sectionNav);
            sectionNav.init(options, this);
        });
    };

    $.fn.sectionNav.defaults = {
        offset: 0,
        threshold: 120,
        speed: 400,
        currentClass: 'current',
        easing: 'swing',
        updateHash: false,
        filter: '',
        onComplete: false,
        beforeStart: false
    };

})(jQuery, window, document);

(function($){

    $(window).on('load', function() {

        var navBreakpoint = 991,
            mobileTest;

        /* ---------------------------------------------- /*
         * Mobile detect
        /* ---------------------------------------------- */

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            mobileTest = true;
        } else {
            mobileTest = false;
        }

        /* ---------------------------------------------- /*
         * Nav hover/click dropdown
        /* ---------------------------------------------- */

        $(window).resize(function(){

            var width    = Math.max($(window).width(), window.innerWidth);
            var menuItem = $('.menu-category-items').not('.mega-menu-col');

            // Remove old margins from sub-menus
            menuItem.children('.sub-menu, .mega-menu').css('margin-left', '');

            if ( width > navBreakpoint ) {
                menuItem.removeClass('sub-menu-open');
            }

            if ( (width > navBreakpoint) && (mobileTest !== true) ) {

                menuItem.children('a').unbind('click');
                menuItem.unbind('mouseenter mouseleave');
                menuItem.on({
                    mouseenter: function () {
                        $(this).addClass('sub-menu-open');
                    },
                    mouseleave: function () {
                        $(this).removeClass('sub-menu-open');
                    }
                });
            } else {
                menuItem.unbind('mouseenter mouseleave');
                menuItem.children('a').unbind('click').click(function(e) {
                    e.preventDefault();
                    $(this).parent().toggleClass('sub-menu-open');

                    // If device has big screen
                    if ( (width > navBreakpoint) && (mobileTest == true) ) {
                        $(this).parent().siblings().removeClass('sub-menu-open');
                        $(this).parent().siblings().find('.sub-menu-open').removeClass('sub-menu-open');
                    }
                });
            }

            // if ( (width > navBreakpoint) && (mobileTest !== true) ) {

            if  (width >= navBreakpoint) {
                menuItem.children('.sub-menu, .mega-menu').each(function() {
                    var a = $(this).offset();
                    var b = $(this).width() + a.left;
                    var c = width - (b + 30);

                    if ( (b + 30) > width ) {
                        $(this).css('margin-left', c);
                    } else {
                        $(this).css('margin-left', '');
                    }
                });
            }

        }).resize();

    });

})(jQuery);