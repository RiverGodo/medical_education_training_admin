<template>
  <Modal :title="isEditLink ? '编辑链接' : '添加链接'"
    v-model="showLinkModalState"
    width="645"
    @on-cancel="handleReset(formName)"
    :footer-hide="true"
    :mask-closable="false"
  >
    <div class="addlink-wrapper">
      <Form
        :model="linkForm"
        :rules="ruleValidate"
        :label-width="138"
        ref="formValidate"
        label-position="left"
      >
        <FormItem label="链接标题" prop="group_name">
          <Input
            v-model="linkForm.group_name"
            placeholder="请输入链接标题..."
          ></Input>
        </FormItem>
        <FormItem label="链接" prop="link_url">
          <Input
            v-model="linkForm.link_url"
            placeholder="请输入链接..."
          ></Input>
        </FormItem>
         <FormItem label="类型">
          <RadioGroup v-model="linkForm.is_mudo">
            <Radio :label="1">
                <span>目睹直播</span>
            </Radio>
            <Radio :label="0">
                <span>其它</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="linkForm.is_mudo" label="秘钥" prop="author_key">
          <Input
            v-model="linkForm.author_key"
            placeholder="请输入秘钥..."
          ></Input>
        </FormItem>
        <FormItem label="开播时间" prop="play_start_time">
          <DatePicker
            :value="linkForm.play_start_time"
            @on-change="handleChangePlayTime"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择开播时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <template slot="label"><span v-if="linkForm.is_mudo" class="note-item-required">*</span>预计直播结束时间</template>
          <DatePicker
            :value="linkForm.play_end_time"
            @on-change="handleChangePlayEndTime"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择预计直播结束时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="解锁条件">
          <Row>
            <Checkbox v-model="timeUnlockState" @on-change="changeUnlockState">时间解锁</Checkbox>
          </Row>
          <Row v-if="timeUnlockState">
            <Col span="5">选择解锁时间</Col>
            <Col span="19"
              ><DatePicker
                :value="linkForm.unlock_time"
                @on-change="handleChangeUnlockTime"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="请选择解锁时间"
                style="width: 200px"
              ></DatePicker
            ></Col>
          </Row>
        </FormItem>
        <FormItem label="">
          <Button
            @click="handleSubmit(formName)"
            type="primary"
            style="width: 200px; margin-left: 120px"
          >
            发布
          </Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
const FORM_NAME = "formValidate";
import postData from "../../../../api/postData";
import axios from 'axios';
export default {
  name: "AddlinkModal",
  props: {
    isEditLink:{
      type:Boolean,
      default:false
    },
    payload: {},
  },
  data() {
    return {
      showLinkModalState: false,
      formName: FORM_NAME,
      timeUnlockState:false,
      linkForm: {},
      ruleValidate: {
        group_name: [
          {
            required: true,
            message: "链接标题不能为空",
            trigger: "blur",
          },
        ],
        link_url: [
          {
            required: true,
            message: "链接不能为空",
            trigger: "blur",
          },
        ],
        author_key: [ {
            required: true,
            message: "秘钥不能为空",
            trigger: "blur",
        },],
        play_start_time: [
          {
            required: true,
            message: "开播时间不能为空",
            trigger: "blur",
          },
        ],
        play_end_time: [
          {
            required: true,
            message: "预计直播结束时间不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 控制时间解锁
    changeUnlockState(val) {
      this.linkForm.unlock_type = val ? 1 : 0
    },
    handleChangePlayTime(val) {
      this.linkForm.play_start_time = val;
    },
    handleChangePlayEndTime(val){
      this.linkForm.play_end_time = val
    },
    handleChangeUnlockTime(val) {
      this.linkForm.unlock_time = val;
    },
    handleClose() {
      this.showLinkModalState = false;
    },
    handleAddLink(params) {
      params = JSON.parse(JSON.stringify(params))
      let url = "product/curriculum_online_catalog/add_link"
      if(this.isEditLink){
        url = "product/curriculum_online_catalog/modify_link"
        params.id = this.payload.id
      }
      PostData(url, params).then(
        (r) => {
          if (r.res_code == 1) {
            this.handleClose();
            this.$emit("add-data-success");
          }
        }
      );
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        console.log(this.linkForm.play_end_time,'KM');
        console.log(valid,'valid');
        if (valid) {
          let { curriculum_id, group_orderby, id: parent_id } = this.payload;
          let params = {
            curriculum_id,
            group_orderby,
            parent_id,
          };
          if(this.linkForm.unlock_type === 1){
            if(new Date(this.linkForm.unlock_time).getTime() > new Date(this.linkForm.play_start_time).getTime()){
              this.$Message.error("解锁时间不得晚于开播时间")
              return
            }
          }
          if(this.linkForm.is_mudo == 1){
             if(this.linkForm.play_end_time){
              if(new Date(this.linkForm.play_end_time).getTime() < new Date(this.linkForm.play_start_time).getTime()){
                this.$Message.error("预计直播结束时间不得早于开播时间")
                return
              }
            }else {
              this.$Message.error("预计直播结束时间不能为空")
              return
            }
          }else{
             if(this.linkForm.play_end_time){
              if(new Date(this.linkForm.play_end_time).getTime() < new Date(this.linkForm.play_start_time).getTime()){
                this.$Message.error("预计直播结束时间不得早于开播时间")
                return
              }
            }
          }
          this.handleAddLink(Object.assign(params, this.linkForm));
        }
      });
    },
    handleReset(name) {
      console.log('sbnsnn')
      this.$refs[name].resetFields();
      this.timeUnlockState = false
      this.linkForm = {
        group_name: "",
        link_url: "",
        is_mudo: 1,
        author_key: '',
        unlock_type:0,
        play_start_time: this.$config.formatTimeHM(new Date()),
        unlock_time: this.$config.formatTimeHM(new Date()),
      };
    },
    handleInitEditData(){
      this.linkForm.group_name = this.payload.group_name
      this.linkForm.link_url = this.payload.link_url
      this.linkForm.author_key = this.payload.author_key
      this.linkForm.is_mudo = this.payload.is_mudo
      this.linkForm.play_start_time = this.payload.play_start_time
      this.linkForm.unlock_time = this.payload.unlock_time
      this.linkForm.unlock_type = this.payload.unlock_type
      this.timeUnlockState = this.payload.unlock_type === 1 ? true : false
    }
  },
  watch: {
    showLinkModalState: {
      handler: function () {
        this.handleReset(this.formName);
        if(this.isEditLink){
          this.handleInitEditData()
        }
      },
    },
  },
};
</script>
<style lang="less" scoped>
.addlink-wrapper {
  padding-top: 40px;
  /deep/ .ivu-btn {
    display: inline-block !important;
  }
}
.note-item-required{
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
}
</style>