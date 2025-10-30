import Vue from "vue";
import App from "./App.vue";
import "./assets/style/page.css";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
