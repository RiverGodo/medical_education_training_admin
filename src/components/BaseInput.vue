<template>
<Row class="base-input-container" :style="{ width: baseInputWidth + 'px' }">
    <Row class='body-header'>
        <slot name="header"></slot>
        <span v-if="closeIcon" class="xght-webfont-close-sign close-dialog-panel" @click="closeDialog"></span>
    </Row>
    <Row class="body-content">
        <slot name="body"></slot>
    </Row>
</Row>
</template>

<script>
export default {
    props: {
        baseInputWidth: {
            type: Number
        }
    },
    data() {
        return {
            closeIcon: false
        }
    },
    methods: {
      closeDialog(){
        this.$emit('closedialog')
      }
    },
    mounted(){
        let doc = document.querySelector('.base-input-container').parentNode;
        if(doc&&doc.className.includes('el-dialog__body')) this.closeIcon = true
    }
}
</script>

<style lang="less">
  .base-input-container{
    margin: 0 auto;

    .body-header {
        h3 {
            margin: 0;
            text-align: left;
            color:#5fa137;
            font-weight: 200;
        }
    }
  }

</style>
