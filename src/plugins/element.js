import Vue from 'vue'
// 按需导入element-ui组件
import {Button,Form,FormItem,Input,Message} from 'element-ui'

// 使用Vue.use注册插件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
