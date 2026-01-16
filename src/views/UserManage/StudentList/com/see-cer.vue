<template>
    <Modal :width="800" v-model="show1" @on-cancel="closeCer" title="查看" footer-hide>
       <div class="cer-body">
            <img style="width: 100%;" :src="imgUrl"/>
            <p class="img-tit grey-medium1">{{imgTitle}}</p>
            <Button @click="download" class="down-btns" type="primary">下载</Button>
       </div>
    </Modal>
</template>

<script>
    export default {
        name: '',
        props: {
            show: {},
            imgUrl: {},
            imgTitle: {}
        },
        data() {
            return {
                show1: false
            }
        },
        watch:{
            show(_new){
                this.show1 = _new
            },
        },
        methods: {
            closeCer(){
                this.show1 = false
                this.$emit('closeCer')
            },
            download() {
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = this.imgUrl + '?response-content-type=application/octet-stream';
                link.download = this.imgTitle
                // link.setAttribute("download", this.imgTitle);
                document.body.appendChild(link);
                link.click();
            },
        }
    }
</script>

<style lang="less" scoped>
    .cer-body{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img-tit{
            margin-top: 20px;
        }
        .down-btns{
            margin-top: 20px;
            width: 120px;
            font-size: 14px !important;
        }
    }
</style>