<template>
    <div class='back-to-top' v-if='isShown'>
        <Row>
            <Button class='btn' type='primary' icon="caret-top" @click='back'>返回顶部</Button>
        </Row>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                isShown:false
            }
        },
        methods:{
            back(){
                // this.$emit('BackToTop');
                window.scrollTo(0,0);
            },
            handleScroll() {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if(scrollTop == 0)   this.isShown = false;
                else  this.isShown = true;
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
</script>
<style lang="less">
    .back-to-top {
        position: fixed;
    }
</style>