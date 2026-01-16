import logo1 from '../assets/img/hcc-logo.png'
import headLogo from '../assets/img/logo2.png'
import logo2 from '../assets/img/logo-white1.jpg'
import Vue from 'vue'
const URL = window.location.href
const learn = URL.includes('//admin.learn.alliancebrh.com/')
const LOGO_TITLE = learn ? '学习中心后台管理系统' : '九划医教后台管理系统'
const LOGIN_LOGO_IMG = learn ? logo1 : '//sfile.9mededu.com/wenda/20190327113914.ico'
const LOGO_IMG = learn ? headLogo : logo2

global.LOGO_TITLE = LOGO_TITLE
global.LOGIN_LOGO_IMG = LOGIN_LOGO_IMG
global.LOGO_IMG = LOGO_IMG
global.IS_LEARN = learn
global.LEARN_CLAS = learn ? '' : ''
document.title = LOGO_TITLE
Vue.prototype.$logo = {
    title: LOGO_TITLE,
    img: LOGO_IMG,
    learn
}