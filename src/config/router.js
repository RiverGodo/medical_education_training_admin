import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'view-design'
const Login = () => import('../views/Login');
const NotFound = () => import('../views/notfound');
const DashBoard = () => import('../views/DashBoard');
const PersonalData = () => import('../views/personal-data/index');
const ManageOnlineCourseChapter = () => import('../views/ProductManage/Online/ManageOnlineCourseChapter');
const nextSemester = () => import('../views/ProductManage/Offline/next-semester');
const ManageNotification = () => import('../views/SystemManage/inform/ManageNotification');
const ManageNews = () => import('../views/SystemManage/news/ManageNews')
const UserManage = () => import('../views/UserManage/index')
const SeeStudent = () => import('../views/UserManage/StudentList/SeeStudent.vue')
const ProductManage = () => import('../views/ProductManage/index')
const OpenProduct = () => import('../views/ProductManage/OpenProduct/index')
const MainProduct = () => import('../views/ProductManage/MainProduct/index')
const ExchangeCode = () => import('../views/SystemManage/ExchangeCode/index')
const UsageRecord = () => import('../views/SystemManage/ExchangeCode/UsageRecord/index')
const MarkingHomework = () => import('../views/ProductManage/Task/MarkingHomework/index')
const AdvertisingMap = () => import('../views/SystemManage/AdvertisingMap/index')
const OpenClass = () => import('../views/SystemManage/OpenClass/index')
const JobList = () => import('../views/tutor/job-list.vue')
const tutorCourse = () => import('../views/tutor/course-management')
const Curriculum = () => import('../views/tutor/curriculum')
const OrderManagement = () => import('../views/Order/OrderManagement/index')
const InvoiceInfo = () => import('../views/Order/InvoiceInfo/index')
const CertificateInfo = () => import('../views/Order/certificate-info/index')
const SystemPrivateLetter = () => import('../views/private-letter-management/SystemPrivateLetter/index')
const UserPrivateLetter = () => import('../views/private-letter-management/UserPrivateLetter/index')
const SayHi = () => import('../views/private-letter-management/SayHi/index')
const RecommendedProducts = () => import('../views/SystemManage/RecommendedProducts/index')
const TutorHead = () => import('../views/tutor/tutor-head')
const ProductionIntersection = () => import('../views/train-manage/intersection/production-intersection')
const LiveCourse = () => import('../views/train-manage/live/live-course')
const IntersectionDetail = () => import('../views/train-manage/intersection/detail')
const LiveCheck = () => import('../views/train-manage/live/live-check')
const ProductGrade = () => import('../views/grade/product-grade')
const StudentGrade = () => import('../views/grade/student-grade')
const AddLb = () => import('../views/SystemManage/lb/add-lb')
const OfflineMap = () => import('../views/ProductManage/Offline/offline-map')
const MapSign =() => import('../views/ProductManage/map-sign')
const creatInstitution = () => import('../views/UserManage/ListInstitutions/creat-institution')
const checkInstitution = () => import('../views/UserManage/ListInstitutions/check-institution')
const CourseData =() => import('../views/course-statistics/course-data.vue')
const CourseDetails =() => import('../views/course-statistics/course-details.vue')
const CreatProduction = () => import('../views/ProductManage/production/creatProduction.vue')
const EvaluationStatistics =() => import('../views/course-grading/evaluation-statistics.vue')
const QuestionsAnswers = () => import('../views/questions-answers-manage/questions-answers.vue')
const NoteManage = () => import('../views/note-manage/index.vue')
const signUp = () => import('../views/ProductManage/Offline/signUp.vue')
const dataManagement = () => import('../views/data-management/data-management.vue')
const instructions = () => import('../views/SystemManage/instructions/instructions.vue')
const BarrageManagement = () => import('../views/operation-management/barrage-management.vue')
const ZoneManagement = () => import('../views/operation-management/zone-management.vue')
const PopUpNotification = () => import('../views/SystemManage/pop-up-notification/index.vue')

Vue.use(VueRouter);
// 页面路由
const routes = [
  {
    path:'',
    redirect:'/login',
  },
  // 导师
  {
    path: '/tutor',
    name: 'tutor',
    component: TutorHead,
    children: [
      {
        path: 'job-list',
        name: 'job-list',
        component: JobList
      },
      {
        path: 'curriculum',
        name: 'curriculum',
        component: Curriculum
      },
    ]
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: signUp
  },
  {
    path:'/dashboard',
    // name:'dashboard',
    component:DashBoard,
    children:[
      // {
      //   path:'',
      //   redirect: 'user-manage'
      // },
      {
        path: 'user-manage',
        name: 'user-manage',
        component: UserManage
      },
      {
        path: 'data-management',
        name: 'data-management',
        component: dataManagement
      },
      {
        path: 'see-student',
        name: 'see-student',
        component: SeeStudent
      },
      {
        path: 'questions-answers',
        name: 'questions-answers',
        component: QuestionsAnswers
      },
      {
        path: 'note-manage',
        name: 'note-management',
        component: NoteManage
      },
        //导师
      {
        path: 'tutor-course',
        name: 'tutor-course',
        component: tutorCourse,
      },
      {
        path: 'personal-data',
        name: 'personal-data',
        component: PersonalData
      },
      {
        path: 'product-manage',
        name: 'product-manage',
        component: ProductManage
      },
      {
        path: 'exchange-code',
        name: 'exchange-code',
        component: ExchangeCode
      },
      //支付订单
      {
        path: 'order-management',
        name: 'order-management',
        component: OrderManagement
      },
      //发票信息
      {
        path: 'invoice-info',
        name: 'invoice-info',
        component: InvoiceInfo
      },
      //证书信息
      {
        path: 'certificate-info',
        name: 'certificate-info',
        component: CertificateInfo
      },
      //系统私信 
      {
        path: 'system-private-letter',
        name: 'system-private-letter',
        component: SystemPrivateLetter
      },
      //用户私信 
      {
        path: 'user-private-letter',
        name: 'user-private-letter',
        component: UserPrivateLetter
      },
      //sayHi 模版
      {
        path: 'say-hi-template',
        name: 'say-hi-template',
        component: SayHi
      },
      // 弹幕管理
      {
        path: 'barrage-management',
        name: 'barrage-management',
        component: BarrageManagement
      },
      {
        path: 'zone-management',
        name: 'zone-management',
        component: ZoneManagement
      },
      // 兑换码使用记录
      {
        path: ':id/usage-record',
        name: 'usage-record',
        component: UsageRecord
      },
      {
        name:'advertising-map',
        path:'advertising-map',
        component:AdvertisingMap
      },
      {
        name: 'instructions',
        path: 'instructions',
        component: instructions,
      },
      {
        name:'add-advertising-map',
        path:'add-advertising-map',
        component:AddLb
      },
      {
        name: 'manage-news',
        path: 'manage-news',
        component: ManageNews
      },
      {
        name:'notification-chat',
        path:'notification-chat',
        component: ManageNotification
      },
      {
        name:'pop-up-notification',
        path:'pop-up-notification',
        component: PopUpNotification
      },
      {
        name:'open-class',
        path:'open-class',
        component: OpenClass
      },
        //培训管理
      {
        name:'recommended-products',
        path:'recommended-products',
        component: RecommendedProducts
      },
      {
        name: 'production-intersection',
        path: 'production-intersection',
        component: ProductionIntersection
      },
      {
        name: 'live-course',
        path: 'live-course',
        component: LiveCourse
      },
      {
        name: 'live-check',
        path: 'live-check',
        component: LiveCheck
      },
      {
        name: 'map-sign',
        path: 'map-sign',
        component: MapSign
      },
      {
        name: 'creat-institution',
        path: 'creat-institution',
        component: creatInstitution
      },
      {
        name: 'check-institution',
        path: 'check-institution',
        component: checkInstitution
      },
      {
        name: 'creat-production',
        path: 'creat-production',
        component: CreatProduction
      },
    ]
  },
  // {
  //   name: 'intersection-detail',
  //   path: '/dashboard/intersection-detail',
  //   component: IntersectionDetail
  // },
  {
    path: '/product',
    name: 'main-product',
    component: MainProduct,
    redirect: '/product/open-product',
    children: [
      {
        path: 'open-product',
        name: 'open-product',
        component: OpenProduct,
      },
      {
        path: 'open-product/online-course-chapter/:id',
        name: 'online-course-chapter',
        component: ManageOnlineCourseChapter
      },
      // 作业--批阅作业
      {
        path: 'open-product/:id/marking-homework',
        name: 'marking-homework',
        component: MarkingHomework
      },
      {
        name:'offline-course',
        path:'open-product/offline-course',
        component: nextSemester
      },
      {
        name: 'intersection-detail',
        path: 'intersection-detail',
        component: IntersectionDetail
      },
      {
        name: 'live-check-product',
        path: 'live-check',
        component: LiveCheck
      },
      {
        name: 'offline-map',
        path: 'open-product/offline-map',
        component: OfflineMap
      },
      {
        name: 'edit-production',
        path: 'edit-production',
        component: CreatProduction
      },
    ]
  },
  {
    name: 'product-grade',
    path: '/product/product-grade',
    component: ProductGrade
  },
  // 课程评分
  {
    name: 'evaluation-statistics',
    path: '/product/evaluation-statistics',
    component: EvaluationStatistics
  },
  // 课程统计
  {
    name: 'course-data',
    path: '/product/course-data',
    component: CourseData
  },
  {
    name: 'course-details',
    path: '/product/course-details',
    component: CourseDetails
  },
  {
    name: 'student-grade',
    path: '/product/student-grade',
    component: StudentGrade
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFound
  },
];
// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  routes: routes
});
export default router;
