<template>
  <div class="private-modal-wrapper">
    <Modal v-model="modalState" title="私信"  @on-cancel="cancel" width="600">
      <Input v-model="content" maxlength="300" :rows="10"  type="textarea" placeholder="请输入内容..."  />
      <div slot="footer">
            <Button  @click="cancel">取消</Button>
            <Button type="primary"  @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "PrivateModal",
  data() {
    return {
      modalState: false,
      content: "",
    };
  },
  methods: {
    clear(){
      this.content = ""
    },
    ok() {
      if(this.content.trim() === ""){
        this.$Message.error("内容不能为空")
        return
      }
      this.$emit("ok",this.content)
      this.cancel()
    },
    cancel() {
      this.modalState = false;
      this.clear()
    },
  },
};
</script>

<style lang="less" scoped>
.private-modal-wrapper{
 
}
 /deep/.ivu-btn {
    display: inline-block !important;
  }
</style>