<template>
    <Tabs v-model="tabName" @on-click="tabs" class="tab-name">
        <TabPane v-if='permissionCode1' label="管理列表" name="item1"><ManagementList v-if="tabName=='item1'" :permission-item1="permissionItem1" /></TabPane>
        <TabPane v-if='permissionCode2' label="机构列表" name="item2"><ListInstitutions  v-if="tabName=='item2'" :permission-item2="permissionItem2" /></TabPane>
        <TabPane v-if='permissionCode6' label="学管列表" name="item6"><LearningManagement v-if="tabName=='item6'" :permission-item6="permissionItem6" /></TabPane>
        <TabPane v-if='permissionCode3' label="导师列表" name="item3"><MentorList v-if="tabName=='item3'" :permission-item3="permissionItem3" /></TabPane>
        <TabPane v-if='permissionCode4' label="用户列表" name="item4"><StudentList v-if="tabName=='item4'" :permission-item4="permissionItem4" /></TabPane>
        <TabPane v-if='permissionCode5' label="讲师列表" name="item5"><LecturerList  v-if="tabName=='item5'" :permission-item5="permissionItem5" /></TabPane>
    </Tabs>
</template>
<script>
  import Vue from 'vue'
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  import LecturerList from './LecturerList/index'
  import LearningManagement from './LearningManagement/index'
  import postData from 'src/api/postData'
  export default {
    name: "UserManage",
    components: { ManagementList, ListInstitutions, StudentList, MentorList, LecturerList, LearningManagement },
    data(){
      return{
        permissionCode1: false,
        permissionCode2: false,
        permissionCode3: false,
        permissionCode4: false,
        permissionCode5: false,
        permissionCode6: false,
        permissionItem1: null,
        permissionItem2: null,
        permissionItem3: null,
        permissionItem4: null,
        permissionItem5: null,
        permissionItem6: null,
        tabName: ''
      }
    },
    methods: {
      setAuth(n,t) {
        this[ 'permissionCode' + n ] = true
        this['permissionItem' + n] = t
      },
      tabs(name){
          this.tabName = name
          sessionStorage.setItem('UserManagePane', name)
      },
      handleAuth(){
        let d = this.$config.getAuth(1)
        if(d){
          d.forEach((t, k) => {
            let n = +t.permission_code.slice(2,4)
            if(k === 0) this.tabName = 'item' + n
            this.setAuth(n,t)
          }); 
        }
        if(sessionStorage.getItem('UserManagePane')){
           this.tabName = sessionStorage.getItem('UserManagePane')   
        }     
      }
    },
    mounted(){
       this.$nextTick(() => {
        this.handleAuth()
       })  
    }
  }
</script>

<style lang="less" scoped>
  .tab-name, /deep/.ivu-tabs-content, .user-manage-main{
    height: 100% !important;
  }
  .user-manage-main{
    position: relative;
  }
  /deep/ .ivu-page{
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
</style>
