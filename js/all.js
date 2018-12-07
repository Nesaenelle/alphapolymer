(function (jQuery, NES_API) {


    var $ = NES_API.SELECTOR;

    NES_API.add('currency', {
        constructor: function () {
            var self = this;
            this.currency = $.find('[data-currency]');
            this.toggleBtn = $.find('[data-currency-toggle]');
            this.menuBtn = $.find('.mobile-currency__title');

            if (this.currency.el) {
                this.list = this.currency.findAll('[data-currency-item]');
                this.list.forEach(function (item) {
                    item.addEvent('click', function () {
                        self.setActive(item);
                    });
                });
            }

            if (this.toggleBtn.el) {
                this.toggleBtn.addEvent('click', function (e) {
                    e.stopPropagation();
                    jQuery('.currencies-list').toggleClass('active')
                });
            }

            if (this.menuBtn.el) {
                this.menuBtn.addEvent('click', function () {
                    jQuery('.currencies-list').toggleClass('active')
                });
            }

            if (jQuery('.currencies-list').length) {
                window.addEventListener('click', function (e) {
                    if (!jQuery('.currencies-list')[0].contains(e.target)) {
                        // burger.classList.remove('active');
                        jQuery('.currencies-list').removeClass('active');
                    }
                }, false);
            }
        },
        setActive: function (curItem) {
            this.list.forEach(function (item) {
                if (item.el === curItem.el) {
                    item.addClass('active')
                } else {
                    item.removeClass('active');
                }
            });
        },
        update: function () {

        }
    });

    NES_API.add('navigation', {
        constructor: function () {
            var links = $.findAll('[data-navigation-link]');
            var routes = [''];
            jQuery('[data-navigation-link]').on('click', function (e) {
                e.preventDefault();
                var id = this.getAttribute('data-navigation-link');
                // self.navigate(id, 0, 500);

                jQuery(".main").moveTo(id);
                NES_API['mobile-menu'].close();
            });

            jQuery(".scroll-down").on('click', function () {
                jQuery(".main").moveDown();
            });

            if (jQuery(".main").length) {
                jQuery(".main").onepage_scroll({
                    easing: "ease",
                    animationTime: 1000,
                    // updateURL: true, 
                    beforeMove: function (index) {
                        links.forEach(function (link) {
                            if (link.getAttr('data-navigation-link') == index) {
                                link.addClass('active');
                            } else {
                                link.removeClass('active');
                            }
                        });
                        if (index == 4) {
                            $.find('.roadmap').setAttr('data-animate', true);
                        }

                        if (index == 7) {
                            jQuery('.footer-form').removeClass('active ready sent');
                            jQuery('.scroll-down').fadeOut(200);
                        } else {
                            jQuery('.footer-form').addClass('active');
                            jQuery('.scroll-down').fadeIn(200);
                        }

                        if (index == 1) {
                            jQuery('.header-create-platform').removeClass('active');
                        } else {
                            jQuery('.header-create-platform').addClass('active');
                        }
                    },
                    afterMove: function (index) {
                        if (index == 4) {
                            $.find('.roadmap').setAttr('data-animate', true);
                        }
                    },
                    loop: false,
                    keyboard: false,
                    pagination: true
                });
            }

        }
    });

    NES_API.add('roadmap', {
        constructor: function () {
            var self = this;
            this.roadmap = $.findAll('[data-roadmap]');
            this.timelines = $.findAll('[data-roadmap-timeline]');
            this.years = $.findAll('[data-roadmap-year]');


            this.timelines.forEach(function (elem, i) {
                i === 0 ? elem.show() : elem.hide();
            });

            this.years.forEach(function (elem, i) {
                elem.addEvent('click', function () {
                    var id = elem.getAttr('data-roadmap-year');
                    self.years.forEach(function (el) {
                        el.el === elem.el ? el.addClass('active') : el.removeClass('active')
                    });
                    self.timelines.forEach(function (el) {
                        el.getAttr('data-roadmap-timeline') === id ? el.show() : el.hide()
                    });
                    jQuery('.roadmap__timeline').scrollLeft(0);
                    self.updateIndicator(0);
                });
            });

            var months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"
            ];
            var date = new Date();
            var monthIndex = date.getMonth();
            var monthName = months[monthIndex - 1].toLowerCase();
            var year = date.getFullYear();

            var weAreHere = jQuery('<div class="we-are-here">We are here</div>');
            var a = jQuery('[ data-roadmap-month="' + monthName + '-' + year + '"]');
            a.append(weAreHere);

            if(jQuery('.roadmap').length){

                jQuery('.roadmap').swipe({
                    swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                        if (phase == "end") {
                            var roadmap__timeline = jQuery('.roadmap__timeline:visible');
                            var width = jQuery('.roadmap__timeline_item:visible').width();
                            var scrollLeft = roadmap__timeline[0].scrollLeft;

                            if (direction == 'left') {
                                    roadmap__timeline.animate({scrollLeft: scrollLeft + width}, 500);
                            }
                            if (direction == 'right') {
                                roadmap__timeline.animate({scrollLeft: scrollLeft - width}, 500);
                            }
                        }
                    }});
            }

            if(jQuery('.team-section .scroller').length) {

                jQuery('.team-section .scroller').swipe({
                    swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                        if (phase == "end") {
                            var roadmap__timeline = jQuery('.team-section .scroller');
                            var width = window.innerWidth;
                            var scrollLeft = roadmap__timeline[0].scrollLeft;

                            if (direction == 'left') {
                                    roadmap__timeline.animate({scrollLeft: scrollLeft + width}, 500);
                            }
                            if (direction == 'right') {
                                roadmap__timeline.animate({scrollLeft: scrollLeft - width}, 500);
                            }
                        }
                    }});
            }

            jQuery('.roadmap__timeline').on('scroll', function() {
                if(jQuery(this).is(':visible')) {
                    var procent = (this.scrollLeft/(this.scrollWidth - window.innerWidth) ) * 100;
                    self.updateIndicator(procent);
                }
            });

            jQuery('.team-section .scroller').on('scroll', function() {
                var procent = (this.scrollLeft/(this.scrollWidth - window.innerWidth) ) * 100;
                self.updateTeamIndicator(procent);
            });
        },

        updateIndicator: function(procent) {
            jQuery('.roadmap-indicator').width(procent+'%');
        },
        updateTeamIndicator: function(procent) {
            jQuery('.team-indicator').width(procent+'%');
        }
    });

    NES_API.add('animation', {
        constructor: function () {

            var elements = $.findAll('[data-animate]');

            window.addEventListener('scroll', function () {
                elements.forEach(function (elem) {
                    if (isInViewport(elem.el, 0)) {
                        if (!elem.getAttr('data-animate')) {
                            elem.setAttr('data-animate', true);
                        }
                    }
                });
            }, false);
        }
    });

    NES_API.add('parallax', {
        constructor: function() {
            var items = $.findAll('[data-paralax]');

            window.addEventListener('mousemove', function(e) {
                items.forEach(function(item) {
                    var valX = (e.clientX)  / parseFloat(item.el.getAttribute('data-paralax'));
                    var valY = (e.clientY)  / parseFloat(item.el.getAttribute('data-paralax'));
                    item.el.style.transform = 'translate('+valX/2+'px, ' + valY + 'px)'
                });
            });
        }
    });


    NES_API.add('mobile-menu', {
        constructor: function () {
            var self = this;
            var openBtn = $.find('[data-menu]');
            this.dropdown = $.find('[data-menu-dropdown]');
            var closeBtn = $.find('[data-menu-dropdown-close]');

            openBtn.addEvent('click', function (e) {
                e.stopPropagation();
                self.dropdown.addClass('active');
            });

            closeBtn.addEvent('click', function (e) {
                // burger.classList.remove('active');
                self.dropdown.removeClass('active');
            });

            window.addEventListener('click', function (e) {
                if (!self.dropdown.el.contains(e.target)) {
                    // burger.classList.remove('active');
                    self.dropdown.removeClass('active');
                }
            }, false);
        },
        close: function () {
            this.dropdown.removeClass('active');
        }
    });

    NES_API.add('swipe', {
        constructor: function () {

            var array = $.findAll('[data-swipe]');

            array.forEach(function (content) {
                var index = 0;
                var indicator = content.find('.swipe-indicator');
                var indicatorItems = indicator.findAll('span');

                jQuery(content.el).swipe({
                    swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                        if (phase == "end") {
                            var items = content.findAll('[data-swipe-item]');
                            if (direction == 'left') {
                                index++;
                                if (index > items.length - 1) index = items.length - 1;

                                indicatorItems.forEach(function (r, i) {
                                    i == index ? r.addClass('active') : r.removeClass('active')
                                });
                                items.forEach(function (item) {
                                    item.getAttr('data-swipe-item') == index ? item.addClass('active') : item.removeClass('active');
                                })
                            }

                            if (direction == 'right') {
                                index--;
                                if (index <= 0) index = 0;

                                indicatorItems.forEach(function (r, i) {
                                    i == index ? r.addClass('active') : r.removeClass('active')
                                });
                                items.forEach(function (item) {
                                    item.getAttr('data-swipe-item') == index ? item.addClass('active') : item.removeClass('active');
                                })
                            }
                        }
                    }
                });
            });


        }
    });

    if ($.exists('#contact-form')) {
        var contactForm = new NES_API.FORM($.find('#contact-form').el);
        contactForm.onSubmit(function (data) {
            var url = document.URL + "mail_library/config.php";
            var param = {
                name: data.login,
                mail: data.email,
                massage_text: data.comment
            }
            //console.log(param);
            jQuery.post(url, param, function (data) {
                //some event after submit
                //answer - data
            });
        });
    }

    if ($.exists('#create-platform-form')) {
        var createForm = new NES_API.FORM($.find('#create-platform-form').el);

        createForm.onSubmit(function (data) {
            // ajax here
            var url = document.URL + "mail_library/MC_library.php";
            var param = {
                user_mail: data.email,
            }
            jQuery.post(url, param, function (data) {
                //some event after submit
                //answer - data
            });
        });
    }

    if ($.exists('#footer-create-platform-form')) {
        var footerCreateForm = new NES_API.FORM($.find('#footer-create-platform-form').el);

        footerCreateForm.onSubmit(function (data) {
            // ajax here

            jQuery('.footer-form').addClass('sent');

            var url = document.URL + "mail_library/MC_library.php";
            var param = {
                user_mail: data.email,
            }
            jQuery.post(url, param, function (data) {
                //some event after submit
                //answer - data
            });
        });
    }


    if ($.exists('#login-form')) {
        var loginForm = new NES_API.FORM($.find('#login-form').el);

        loginForm.onSubmit(function (data) {
            // ajax here
            alert('Success');
            return;
            jQuery.ajax({
                method: 'POST',
                url: '',
                data: {},
                success: function () {

                },
                error: function () {

                }
            })
        });
    }

    if ($.exists('#signup-form')) {
        var signupForm = new NES_API.FORM($.find('#signup-form').el);
        signupForm.onSubmit(function (data) {
            // ajax here
            alert('Success');
            return;
            jQuery.ajax({
                method: 'POST',
                url: '',
                data: {},
                success: function () {

                },
                error: function () {

                }
            })
        });
    }

    jQuery('.create-trading-btn').on('click', function () {
        jQuery('.footer-form').toggleClass('ready');
    });
    jQuery('.submit-create-trading-form').on('click', function () {
        jQuery('#footer-create-platform-form').submit();
    });

    if (jQuery('.footer-form').length) {
        window.addEventListener('click', function (e) {
            if (!jQuery('.footer-form')[0].contains(e.target)) {
                // burger.classList.remove('active');
                jQuery('.footer-form').removeClass('ready sent');
            }
        }, false);
    }




    NES_API.init();

}($, NES_API));

$('.slick-slider').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    nextArrow: '<div class="arrow-right"></div>',
    prevArrow: '<div class="arrow-left"></div>',
    responsive: [{
        breakpoint: 1024,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
        }
    }]
});


function isScrolledIntoView(elem, offsetVal) {
    var docViewTop = window.pageYOffset;
    var docViewBottom = docViewTop + window.innerHeight;
    var elemTop = offset(elem).top;
    var elemBottom = elemTop + elem.clientHeight;
    return docViewTop >= elemTop - (offsetVal || 200) /*- window.innerHeight*/ ; // /((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    }
}

function isInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
    );
};