var languages = ['ru', 'ua', 'en']
var langState$ = new rxjs.BehaviorSubject();
var product$ = new rxjs.BehaviorSubject();
var products$ = new rxjs.BehaviorSubject();
var resources$ = new rxjs.BehaviorSubject();
var fromProduct$ = new rxjs.BehaviorSubject();

function defaultLanguage() {
    // window.location.hash = 'ru';
    localStorage.setItem('lang', 'ru');
    langState$.next('ru');
}

checkLanguage();

function checkLanguage() {
    var lang = localStorage.getItem('lang');
    if (!lang) {
        defaultLanguage();
    } else {
        if (languages.indexOf(lang) > -1) {
            langState$.next(lang);
        } else {
            defaultLanguage();
        }
    }
}


Vue.component('app-pagination', {
    data: function() {
        return {

        }
    },
    template: '#pagination-template',
    methods: {
        prev: function() {
            $(".main").moveUp();
        },
        next: function() {
            $(".main").moveDown();
        }
    }
});

Vue.component('app-language', {
    data: function() {
        return {
            languages: languages,
            activeLang: languages[0],
            active: 0,
            visible: false
        }
    },
    template: '#language-template',
    mounted: function() {
        var self = this;
        langState$
            .subscribe(function(res) {
                if (!res) return;
                self.activeLang = res;
            });
        window.addEventListener('click', function(e) {
            if (!self.$el.contains(e.target)) {
                self.visible = false;
            }
        }, false)
    },
    methods: {
        changeLang: function(lang) {
            langState$.next(lang);
            localStorage.setItem('lang', lang);
            this.visible = false;
        },
        toggle: function() {
            this.visible = !this.visible;
        }
    }
});


Vue.component('app-product', {
    data: function() {
        return {
            product: {},
            langState$: langState$
        }
    },
    template: '#product-template',
    mounted: function() {
        var self = this;
        product$.subscribe(function(res) {
            if (!res) return;
            var product = products$.getValue().data.filter(function(r){ return r.id == res})[0];
            if (product) {
                self.product = product;
            }
        });
    },
    methods: {
        goTo: function(id) {
            jQuery(".main").moveTo(id);
            fromProduct$.next(this.product);
        },
        prev: function() {
            var index = product$.getValue();
            index--;
            if (index <= 0) {
                index = 1;
            }

            product$.next(index);
        },
        next: function() {
            var index = product$.getValue();
            index++;

            if (index >= products$.getValue().data.length) {
                index = products$.getValue().data.length;
            }

            product$.next(index);
        }
    }
});

Vue.component('app-contacts', {
    data: function() {
        return {
            form: {},
            Resources: {},
            product: null,
            submitted: false
        }
    },
    template: '#contacts-template',
    mounted: function() {
        var self = this;
        resources$.subscribe(function(res) {
            if (res) {
                self.Resources = res;
            }
        });

        fromProduct$.subscribe(function(product) {
            if (product) {
                self.product = product;
            } else {
                self.product = null;
            }
        });
    },
    methods: {
        goTo: function() {
            jQuery(".main").moveTo('6');
            product$.next(this.product.id);
        },
        submit: function() {
            // this.form;
            this.submitted = true;
        }
    }
});

Vue.component('app-menu', {
    data: function() {
        return {
            Resources: {},
            menuIsActivated: false
        }
    },
    template: '#menu-template',
    mounted: function() {
        var self = this;
        resources$.subscribe(function(res) {
            if (res) {
                self.Resources = res;
            }
        });

        window.addEventListener('click', function(e) {
            if (!self.$el.contains(e.target)) {
                self.menuIsActivated = false;
            }
        }, false)
    },
    methods: {
        goTo: function(id) {
            jQuery(".main").moveTo(id);
            fromProduct$.next(null);
            this.menuIsActivated = false;
        },
        toggle: function() {
            this.menuIsActivated = !this.menuIsActivated;
        },
        close: function() {
            this.menuIsActivated = false;
        }
    }
});


var app = new Vue({
    el: '#app',
    data: {
        Resources: {},
        langState$: langState$
    },
    mounted: function() {
        var self = this;
        langState$
            .subscribe(function(res) {
                if (!res) return;
                self.$http.get('./translate/' + res + '.json').then(function(response) {
                    self.Resources = response.body;
                    resources$.next(response.body);
                });
            });

        var links = document.querySelectorAll('[href^="#"]');
        links = Array.prototype.slice.call(links);

        $(".main").onepage_scroll({
            easing: "ease",
            animationTime: 1000,
            // updateURL: true, 
            beforeMove: function(index) {
                links.forEach(function(link) {
                    if (link.getAttribute('href').substr(1) == index) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                if (index == 6) {

                }
            },
            afterMove: function(index) {

            },
            updateURL: true,
            loop: false,
            keyboard: false,
            pagination: false,
            direction: "horizontal"
        });


        this.$http.get('./products.json').then(function(response) {
            products$.next(response.body);
            product$.next(response.body.data[0].id);
        });
    },
    methods: {
        goTo: function(id, productId) {
            jQuery(".main").moveTo(id);
            fromProduct$.next(null);
            if (productId) {
                product$.next(productId);
            }
        }
    }
});


$('.wrapper').animate({ opacity: 1 }, 1000);

// $(window).on('hashchange', function() {
//   if (location.hash) {
//       jQuery(".main").moveTo(3);
//   } else {
//       jQuery(".main").moveTo(1);
//   }
// });

;
(function() {
    function domReady(f) { /in/.test(document.readyState) ? setTimeout(domReady, 16, f) : f() }

    function resize(event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize(event) {
        window.setTimeout(resize, 0, event);
    }

    domReady(function() {
        var textareas = document.querySelectorAll('textarea[auto-resize]')

        for (var i = 0, l = textareas.length; i < l; ++i) {
            var el = textareas.item(i)

            el.addEventListener('change', resize, false);
            el.addEventListener('cut', delayedResize, false);
            el.addEventListener('paste', delayedResize, false);
            el.addEventListener('drop', delayedResize, false);
            el.addEventListener('keydown', delayedResize, false);
        }
    })
}());