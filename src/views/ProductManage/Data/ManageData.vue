<template>
  <div>
    <screen />
    <div class="data-wrapper">
      <div class="title title-item">真实数据：</div>
      <div class="sub-title title-item">学习人次：100</div>
      <div class="sub-title title-item">获证人次：200</div>
      <div class="data-config">
        <Switch v-model="useTrueData" @on-change="changeDataOrigin">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </Switch>
        配置数据
      </div>
      <div class="sub-title title-item middle">
        学习人次：
        <div style="width:200px"><InputNumber :min="0" v-model="mockStudyNum"></InputNumber></div>
      </div>
      <div class="sub-title title-item middle">
        获证人次：
        <div style="width:200px"><InputNumber :min="0" v-model="mockCertificationNum"></InputNumber></div>
      </div>
    </div>
  </div>
</template>

<script>
import screen from "../../../components/ScreenFrame";
export default {
  name: "ManageData",
  components: {
    screen,
  },
  data() {
    return {
      useTrueData: false,
      mockStudyNum: 0,
      mockCertificationNum: 0,
    };
  },
  methods: {
    changeDataOrigin(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
.middle{
  display: flex;
  align-items: center;
}
.data-wrapper {
  padding: 50px;
  .title-item {
    margin: 10px 0;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 16px;
  }
  .data-config{
    margin-top: 40px;
  }
}
</style>