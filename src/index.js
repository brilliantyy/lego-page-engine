import Vue from 'vue'
import Http from '@/utils/Http'
import initPage from '@/register'
import DataService from '@/http/dataCenter'
import '@/style/common.css'

Vue.use(Http)
Vue.use(DataService)

initPage()
