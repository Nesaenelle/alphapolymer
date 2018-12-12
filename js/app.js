var languages = ['ru', 'ua', 'en']
var langState = new rxjs.BehaviorSubject();

function defaultLanguage() {
    // window.location.hash = 'ru';
    localStorage.setItem('lang', 'ru');
    langState.next('ru');
}

checkLanguage();

function checkLanguage() {
    var lang = localStorage.getItem('lang');
    if (!lang) {
        defaultLanguage();
    } else {
        if (languages.indexOf(lang) > -1) {
            langState.next(lang);
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
    template: '<div class="pagination"><div class="pagination__prev" @click="prev()"></div><div class="pagination__next" @click="next()"></div></div>',
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
    mounted() {
        var self = this;
        langState
            .subscribe(res => {
                if (!res) return;
                this.activeLang = res;
            });
        window.addEventListener('click', function(e) {
            if (!self.$el.contains(e.target)) {
                self.visible = false;
            }
        }, false)
    },
    methods: {
        changeLang: function(lang) {
            langState.next(lang);
            localStorage.setItem('lang', lang);
            this.visible = false;
        },
        toggle: function() {
            this.visible = !this.visible;
        }
    }
});


var app = new Vue({
    el: '#app',
    data: {
        Resources: {}
    },
    mounted() {
        langState
            .subscribe(res => {
                if (!res) return;
                if (res === 'ru') {
                    this.$http.get('/translate/ru.json').then(response => {
                        this.Resources = response.body;
                    }, response => {

                    });
                }

                if (res === 'en') {
                    this.$http.get('/translate/en.json').then(response => {
                        this.Resources = response.body;
                    }, response => {

                    });
                }

                if (res === 'ua') {
                    this.$http.get('/translate/ua.json').then(response => {
                        this.Resources = response.body;
                    }, response => {

                    });
                }
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
            },
            afterMove: function(index) {

            },
            loop: false,
            keyboard: false,
            pagination: false,
            direction: "horizontal"
        });
    },
    methods: {
        goTo: function(id) {
            jQuery(".main").moveTo(id);
        }
    }
});