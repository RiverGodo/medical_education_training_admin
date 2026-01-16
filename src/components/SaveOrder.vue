<template>
    <div class='save-order'>
        <Row>
            <Button class='btn-cancel' type='primary' :plain='true' @click='cancelHandler'>取消</Button>
            <Button class='btn-save' type='primary' :plain='true' @click='saveHandler'>保存</Button>
        </Row>
    </div>
</template>
<script>
    export default{
        methods:{
            saveHandler(){
                this.$emit('saveOrder');
            },
            cancelHandler(){
                this.$emit('cancelChange');
            }
        }
    }
</script>
<style lang="less">
    .save-order {
        .btn-save {
            border-color: #3DAAFF;
            color: #fff;
        }
        .save {
            position: fixed;
            top:40%;
            right: 10px;
            background-color: #3DAAFF;
            box-shadow: 0 0 20px 0 rgba(251,131,62,0.50);
            border-radius: 50%;
            width: 70px;
            height: 70px;
            cursor: pointer;
            p {
                font-size: 12px;
                color: #FFFFFF;
                letter-spacing: 0;
                width: 100%;
                text-align: center;
                margin: 5px 0;

                &:first-child {
                    font-size: 24px;
                    margin-bottom: 2px;
                }

                &:last-child {
                    margin-top: 2px;
                }
            }
        }
    }
</style>
