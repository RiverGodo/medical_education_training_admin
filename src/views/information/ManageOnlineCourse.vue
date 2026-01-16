<template>
    <div class='manage-online-course'>
      <!-- <header-component title="线上课" :type='1' :showAdd='true' @addCourse='addCourseHandler' @reRenderList="reRenderListHandler"/> -->
      <screen :types="1" size-title1="线上课总数" :size-num1="12" btn-name="添加线上课" @handleClick="addCourseHandler" @reRenderList="reRenderListHandler"/>
        <data-list @editChapter='editChapterHandler' @editCourse='editCourseHandler' @moveUp='moveUpHandler'
                   @moveDown='moveDownHandler'
                   @deleteCourse='deleteCourseHandler' class='data-list light-header' :table-data='dataList'
                   :header-data='dataHeader'
                   :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'
                   :table-height='listHeight'/>
        <save-order v-if='dirty' @saveOrder='saveOrderHandler' @cancelChange='resetCurriculumOrder'/>
    </div>
</template>

<script>
  import Header from '../../components/ProjectHeader'
  import BaseList from '../../components/BaseList'
  import SaveOrder from '../../components/SaveOrder'
  import {doTimeFormat} from '../../components/Util'
  import {Dialog} from '../dialogs/index';
  import {ADD_COURSE} from '../dialogs/types'
  import {Config} from '../../config/base'
  import screen from '../../components/ScreenFrame'

  export default {
    mixins: [Dialog],
    data() {
      return {
        dirty: false,
        loadingInstance: null
      }
    },
    computed: {
      dataHeader() {
        return [{
          sort: true,
          label: '序号',
          width: 90
        }, 
        {
          prop: 'title',
          label: '课程名称',
          minWidth: 200
        },
        {
          prop: 'teacher_name',
          label: '讲师',
          width: 100
        }, 
         {
          prop: 'subject_id',
          label: '科室',
          width: 80
        }, 
        {
          prop: 'grade_id',
          label: '年级',
          width: 80
        },
         {
          prop: 'state',
          label: '状态',
          width: 80
        }, {
          prop: 'create_time',
          label: '创建时间',
          width: 120
        }, {
          label: '操作',
          width: 350,
          groupBtn: [{
            text: '添加章节',
            param: 'editChapter'
          }, {
            text: '编辑课程',
            param: 'editCourse',
            // hoverShow: true
          }, 
          // {
          //   text: 'md-arrow-dropup',
          //   param: 'moveUp',
          //   // hoverShow: true,
          //   isIcon: true
          // }, {
          //   text: 'md-arrow-dropdown',
          //   param: 'moveDown',
          //   // hoverShow: true,
          //   isIcon: true
          // }, 
          {
            text: '删除',
            param: 'deleteCourse',
            // hoverShow: true,
            // isIcon: true
          }]
        }]
      },
      listColumnFormatter() {
        return [{
          columnName: 'create_time',
          doFormat: doTimeFormat
        }, {
          columnName: 'grade_id',
          dataIndex: 0,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'subject_id',
          dataIndex: 1,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'state',
          dataIndex: 2,
          dataProp: 'id',
          dataValue: 'name'
        }]
      },
      listColumnFormatterData() {
        return [this.gradeList, this.subjectList, this.stateList];
      },
      dataList() {
        return this.$store.state.online_curriculum.online_curriculum_list;
      },
      subjectList() {
        return this.$store.state.subject.subject_list;
      },
      stateList() {
        return this.$store.state.online_curriculum.stateList;
      },
      gradeList() {
        return this.$store.state.grade.grade_list;
      },
      // isLoading() {
      //   return this.$store.state.online_curriculum.showMainLoading;
      // },
      listHeight() {
        return window.innerHeight - 60 - 50;
      }
    },
    watch: {
      listColumnFormatterData(val) {},
      // isLoading(val) {
      //   if (val) {
      //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
      //     setTimeout(() => {
      //       this.loadingInstance.close();
      //     }, Config.base_timeout);
      //   } else {
      //     if (this.loadingInstance) this.loadingInstance.close();
      //     this.dirty = false;
      //   }
      // },
      projectId(v) {
        this.$store.dispatch('get_online_curriculum_list', {
          project_id: v
        });
      },
      // dataList(v) {
      //   var loadingInstance = null;
      //   if (v) {
      //     setTimeout(a => {
      //       loadingInstance && loadingInstance.close();
      //     }, Config.base_timeout)
      //   } else {
      //     loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
      //   }
      // }
    },
    methods: {
      editChapterHandler(index) {
        this.$router.push({
          name: 'online-course-chapter',
          params: {
            id: this.dataList[index].curriculum_id
          }
        });
      },
      editCourseHandler(index) {
        this.handleSelModal(ADD_COURSE, this.dataList[index]);
      },
      reRenderListHandler(v) {
        if (this.$store.state.project.project_list.length > 0) {
          this.$store.dispatch('get_online_curriculum_list', {
            project_id: v
          });
        }
      },
      moveUpHandler(index) {
        this.dirty = true;
        this.$store.dispatch('change_online_curriculum_orderby', {
          curriculum_id: this.dataList[index].curriculum_id,
          dir: 0
        });
      },
      moveDownHandler(index) {
        this.dirty = true;
        this.$store.dispatch('change_online_curriculum_orderby', {
          curriculum_id: this.dataList[index].curriculum_id,
          dir: 1
        });
      },
      resetCurriculumOrder() {
        this.$store.dispatch('reset_online_curriculum_orderby');
        this.dirty = false;
      },
      deleteCourseHandler(index) {
        if (this.dirty) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>您已修改课程排序，是否放弃保存</p>',
            onOk: () => {
              this.resetCurriculumOrder();
              this.showDeleteConfirm(this.dataList[index].curriculum_id);
            },
          });
        } else {
          this.showDeleteConfirm(this.dataList[index].curriculum_id);
        }
      },
      showDeleteConfirm(curriculum_id) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该课程？</p>',
          onOk: () => {
            this.$store.dispatch('delete_online_curriculum', {
              curriculum_id: curriculum_id
            })
          },
        });
      },
      saveOrderHandler() {
        this.$store.dispatch('save_online_curriculum_orderby');
      },
      addCourseHandler() {
        if (this.dirty) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>您已修改课程排序，是否放弃保存</p>',
            onOk: () => {
              this.resetCurriculumOrder();
              this.handleSelModal(ADD_COURSE);
            },
          });
        } else this.handleSelModal(ADD_COURSE);
      },
      initData() {
        var vm = this;
        if (this.$store.state.project.project_list.length === 0) {
          // var loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
          this.$store.dispatch('get_project_list', {
            callback(v) {
              // loadingInstance && loadingInstance.close();
              if (vm.dataList.length === 0) {
                vm.$store.dispatch('get_online_curriculum_list', {
                  project_id: v
                }).then(res => {
                  vm.$store.dispatch('get_grade_list')
                  vm.$store.dispatch('get_subject_list')
                });
              }
            }
          })
        } else {
          this.$store.dispatch('get_online_curriculum_list', {
            project_id: this.$store.state.project.select_project_id
          }).then(res => {
            this.$store.dispatch('get_grade_list');
            this.$store.dispatch('get_subject_list');
          });
        }
      }
    },
    created() {
      this.initData();
    },
    components: {
      'header-component': Header,
      'data-list': BaseList,
      'save-order': SaveOrder,
      screen
    }
  }

</script>
<style scoped lang="less">
  /deep/ .ivu-btn-text{color: #4098FF }
</style>
