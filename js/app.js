Vue.filter('translate', function(value) {
    return value;
})

var languages = ['ru', 'ua', 'en']
var langState = new rxjs.BehaviorSubject();

function defaultLanguage() {
    window.location.hash = 'ru';
    langState.next('ru');
}

checkLanguage();

function checkLanguage() {
    if (!window.location.hash) {
        defaultLanguage();
    } else {
        if (languages.indexOf(window.location.hash.substr(1)) > -1) {
            langState.next(window.location.hash.substr(1));
        } else {
            defaultLanguage();
        }
    }
}


window.addEventListener("hashchange", function() {
    checkLanguage()
}, false);


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
    },
    methods: {
        changeLang: function(lang) {
            langState.next(lang);
            window.location.hash = lang;
        }
    }
});