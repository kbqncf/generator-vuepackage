//引入sass
require("../../sass/common/com.scss");
require("../../sass/page/index.scss");
//引入js
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
//引入mint-ui
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

//使用router
Vue.use(VueRouter);
//使用resource
Vue.use(VueResource);
//使用mint-ui
Vue.use(Mint);
//注入拦截
Vue.http.interceptors.push((request, next) => {
    //发送请求前的处理逻辑
    Mint.Indicator.open();
    next(function (response) {
        // 请求发送后的处理逻辑
        Mint.Indicator.close();
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
    });
});