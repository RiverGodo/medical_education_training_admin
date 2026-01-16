<template>
  <div>
    <private-modal
      :is-show="show"
      :title="title"
      @handle-update-list="handleUpdateList"
      @handle-close="handleClose"
      @handle-submit="handleSubmit"
      :creat="creat"
      :message="message"
      :modal-width="modalWidth"
      :person-message="personMessage"
      @submit="submit"
      :isEditor="isEditor"
      :dataRow="dataRow"
    />
    <screen
      @resetPage="resetPage"
      :types="10"
      title="sayhi 模板"
      btnType
      btnName="添加模板"
      @handleClick="handleClick"
      style="background: #ffffff"
    />
    <tables
      :is-serial="pageDataCount"
      :column="columns1"
      :table-data="list"
      :tabel-height="tableHeight"
      @operation0="handleEditSayHi"
      @operation1="handleSetSayHi"
      @operation2="handleDeleteSayHi"
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
import screen from "components/ScreenFrame";
import formModal from "components/FormModal";
import privateModal from "./modal";
import tables from "components/tables";
import pageList from "components/Page";
import pageMixin from "../../mixins/pageMixins";
import postData from "api/postData";

export default {
  components: { screen, formModal, privateModal, tables, pageList },
  mixins: [pageMixin],
  data() {
    return {
      show: false,
      creat: true,
      title: "",
      columns1: [
        { title: "模板内容", key: "content", minWidth: 200, align: "left" },
        {
          title: "状态",
          key: "state",
          minWidth: 100,
          align: "left",
          render: (h, params) => {
            let d = params.row.state == 1 ? "启用" : "禁用";
            return h("span", d);
          },
        },
        { title: "使用次数", key: "use_num", minWidth: 100 },
        { title: "创建时间", key: "create_time", minWidth: 130 },
        { title: "创建人", key: "realname", minWidth: 100 },
        {
          title: "操作",
          minWidth: 220,
          slot: "operation",
          align: "left",
          operation_state: true,
          operation: [
            ["编辑", "operation0"],
            [["禁用", "启用"], "operation1"],
            ["删除", "operation2"],
          ],
        },
      ],
      list: [],
      tableHeight: null,
      message: "",
      modalWidth: 800,
      personMessage: {},
      isEditor: false,
      dataRow: {},
    };
  },
  mounted() {
    this.tableHeight = window.innerHeight - 130;
  },
  methods: {
    handleClick() {
      this.isEditor = false;
      this.title = "添加sayhi模板";
      this.modalWidth = 900;
      this.show = true;
      this.creat = true;
    },
    handleClose() {
      this.show = false;
      this.personMessage = {};
    },
    handleSubmit(val) {
      console.log("提交");
    },
    handleEditSayHi(val) {
      this.show = true;
      this.title = "编辑sayhi";
      this.dataRow = val;
      this.isEditor = true;
      this.modalWidth = 960;
      // postData('pmsg/getPMsgDetail', {msg_id: val.id}).then(res => {
      //     this.personMessage = res.data
      // })
    },
    handleSetSayHi(val) {
      let params = {
        id: val.id,
        state: val.state === 0 ? 1 : 0 ,
      };
      let msg = val.state === 0 ? '启用' : '禁用'
      postData("/pmsg/setSayHi", params).then((res) => {
        if (res.res_code === 1) {
          this.$Message.success(`${msg}成功`);
          this.getList();
        } else {
          this.$Message.error(`${msg}失败`);
        }
      });
    },
    handleDeleteSayHi(val) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确认删除该模板？</p>",
        onOk: () => {
          let params = {
            id: val.id,
          };
          postData("/pmsg/delSayHi", params).then((res) => {
            if (res.res_code === 1) {
              this.$Message.success("删除成功");
              this.getList();
            } else {
              this.$Message.error("删除失败");
            }
          });
        },
      });
    },
    getList() {
      var data = {
        page_num: this.current,
        page_size: this.pageSize,
      };
      postData("pmsg/getSayHiList", data).then((res) => {
        if (res.res_code == 1) {
          this.total = res.data.count;
          this.list = res.data.data;
        }
      });
    },
    submit() {
      this.getList();
      this.handleClose();
    },
    handleUpdateList() {
      this.getList();
    },
  },
  mounted() {
    this.tableHeight = window.innerHeight - 130;
    this.getList();
  },
};
</script>

<style scoped lang="less">
</style>
