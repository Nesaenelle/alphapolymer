Vue.filter('translate', function (value) {
  if (!value) return ''
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1)
})


var app = new Vue({
    el: '#app',
    data: {
       Resources: {}
    },
    mounted() {
    	 this.$http.get('/translate/ru.json').then(response => {
    	 	this.Resources = response.body;
    	 }, response => {
    	
    	 });
    }
});