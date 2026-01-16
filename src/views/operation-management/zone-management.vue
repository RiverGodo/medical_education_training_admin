<template>
  <div class="barrage-management">
    <ForbiddenModal @closeModal="closeModal" :user="user" :show="show" />
    <PrivateModal ref="privateModalRef" @ok="handleSendPrivateLetter" />
    <div class="head">
      <Input
        v-model="content"
        placeholder="搜索评论内容"
        @on-change="inputChange"
        class="input"
      >
        <Icon type="md-search" slot="prefix" />
      </Input>
      <Input
        v-model="username"
        placeholder="搜索用户名"
        @on-change="inputChange"
        class="input"
      >
        <Icon type="md-search" slot="prefix" />
      </Input>
      <div class="date-picker-wrapper">
        <DatePicker
          type="datetimerange"
          placeholder="请选择时间范围"
          style="margin-left: 20px"
          @on-change="handleChangeSelectTime"
        ></DatePicker>
      </div>
    </div>

    <Tables
      @tableSelect="tableSelect"
      @shield="shield"
      @forbidden="forbidden"
      @letter="letter"
      :tabel-height="tableHeight"
      :is-serial="pageDataCount"
      :column="columns1"
      :table-data="list"
    />
    <page-list
      :current="current"
      :total="total"
      :page-size="pageSize"
      @page-list="pageList"
    />
  </div>
</template>

<script>
import Tables from "../../components/tables.vue";
import pageList from "../../components/Page";
import pageMixin from "../mixins/pageMixins";
import ForbiddenModal from "./com/forbidden-modal";
import PrivateModal from "./com/private-modal";
export default {
  name: "barrage-management",
  components: { Tables, pageList, ForbiddenModal, PrivateModal },
  mixins: [pageMixin],
  data() {
    return {
      user: null,
      show: false,
      state: null,
      list: [],
      tableHeight: 0,
      content: '',
      username: '',
      start_time:'',
      end_time:'',
      columns1: [
        {
          title: "评论内容",
          key: "content",
          minWidth: 200,
          align: "left",
          render: (h, params) => {
            return h("span", params.row.content);
          },
        },
        {
          title: "状态",
          key: "state",
          minWidth: 90,
          filters: [
            {
              label: "正常",
              value: 1,
            },
            {
              label: "已屏蔽",
              value: 0,
            },
          ],
          filterRemote(value) {
            this.$emit("tableSelect", "state", value);
          },
          filterMultiple: false,
          render: (h, params) => {
            return h("span", params.row.state == 1 ? "正常" : "已屏蔽");
          },
        },
        {
          title: "用户名",
          key: "realname",
          minWidth: 150,
          render: (h, params) => {
            return h("span", `${params.row.realname}(${params.row.user_id})`);
          },
        },
        {
          title: "发布时间",
          key: "create_time",
          minWidth: 150,
        },
        {
          title: "操作",
          width: 220,
          slot: "operation",
          align: "left",
          operation_state: true,
          operation: [
            [["屏蔽", "取消屏蔽"], "shield"],
            ["禁言", "forbidden"],
            ["私信", "letter"],
          ],
        },
      ],
      inputTimer:null
    };
  },
  methods: {
    handleChangeSelectTime(value){
      if(this.inputTimer){
        clearTimeout(this.inputTimer)
      }
      this.inputTimer = setTimeout(()=>{
        this.current = 1;
        this.start_time = value[0]
        this.end_time = value[1]
        this.getList();
      },300)
    },
    inputChange() {
      if(this.inputTimer){
        clearTimeout(this.inputTimer)
      }
      this.inputTimer = setTimeout(()=>{
        this.current = 1;
        this.getList();
      },300)
      
    },
    getList() {
      let d = {
        content:this.content,
        username:this.username,
        page_size: this.pageSize,
        page_num: this.current,
        start_time:this.start_time,
        end_time:this.end_time,
        state:this.state
      };
      PostData("/circle/getCommentList", d).then((res) => {
        this.list = res.data.data;
        this.total = res.data.count;
      });
    },
    shield(row, index) {
      const state = row.state === 1 ? 0 : 1;
      const text = state === 1 ? "取消屏蔽成功" : "屏蔽成功";
      PostData("/circle/setState", { id: row.id, state }).then((res) => {
        if (res) {
          this.$Message.success(text);
          this.list.splice(index, 1, { ...this.list[index], state });
        }
      });
    },
    closeModal() {
      this.show = false;
    },
    forbidden(row, index) {
      this.show = true;
      this.user = { realname: row.realname, user_id: row.user_id };
    },
    letter(row, index) {
      this.currentRowData = row;
      this.handleOpenPrivateModal(true);
    },
    tableSelect(type, val) {
      this.current = 1;
      this[type] = val[0];
      this.getList();
    },
    handleOpenPrivateModal(state) {
      this.$refs.privateModalRef.modalState = state;
    },
    handleSendPrivateLetter(content) {
      let params = {
        content,
        student_ids: [this.currentRowData.user_id],
      };
      PostData("/pmsg/addPMsg", params).then((res) => {
        if (res.res_code === 1) {
          this.$Message.success("发送成功");
        } else {
          this.$Message.error("发送失败");
        }
      });
    },
  },
  mounted() {
    this.tableHeight = window.innerHeight - 116;
    if (this.$route.query.catalog_id) {
      this.catalog_id = this.$route.query.catalog_id;
    }
    this.getList();
  },
};
</script>
<style lang="less" scoped>
@import url("../../css/input.less");
/deep/ .ivu-btn {
    display: inline-block !important;
}
.barrage-management {
  
  .head {
    height: 66px;
    min-width: 800px;
    background: #fff;
    display: flex;
    // align-items: center;
    padding-left: 21px;
    padding-right: 31px;
    z-index: 9999;
    margin-top: 15px;
    .date-picker-wrapper {
      width: 450px;
    }
    .slide-view {
      flex: 1;
      display: flex;
      margin-left: 10px;
      height: 66px;
      .slider-text {
        line-height: 36px;
      }
      .slide {
        display: flex;
        flex: 1;
        margin-left: 10px;
      }
      .slider-time {
        margin-left: 10px;
      }
    }
  }
}
</style>
<style>
</style>