<template>
    <Row type='flex' justify='left' align='middle' class='input-container'>
        <input type='text' :placeholder='m_placeholder' @keypress='onKeyDown' v-model='m_model'/>
        <a @click='plus'><i class='el-icon-plus'></i></a>
        <a @click='minus'><i class='el-icon-minus'></i></a>
    </Row>
</template>

<style lang="less">
    .input-container {
        border: 1px solid #CECECE;
        border-radius:4px;
        input {
            width:100%;
            height:36px;
            padding:3px 10px;
            outline:0;
            font-size:inherit;
            box-sizing:border-box;
            border:0;
            &:focus {
                outline:0;
            }
        }

        a {
            padding:10px 11px;
            border-left:1px solid #CECECE;
            color:#D6D6D6;
            cursor:pointer;
        }
    }
</style>

<script>
    export default{
        data(){
            return{
                m_placeholder:this.placeholder,
                m_model:this.model
            }
        },
        props:{
            placeholder:{
                type:String,
                default:'请输入数字'
            },
            model:{
                type:Number,
                default:0
            }
        },
        watch: {
            m_model(){
                this.$emit('countChange',this.m_model);
            }
        },
        methods:{
            onKeyDown(event) {
                var keyCode = event.keyCode;
                var keyStr = String.fromCharCode(keyCode);
                event.returnValue = /\d/.test(keyStr);
            },
            plus() {
                this.m_model ++;
            },
            minus() {
                if(this.m_model > 0)
                   this.m_model --;
            }
        }
    }
</script>