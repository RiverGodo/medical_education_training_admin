<template>
    <div class="layout">
        <div class="layout-header">
            <slot name="header"></slot>
        </div>
        <div class="layout-content">
            <div class="layout-nav">{{layoutNav}}</div>
            <div class="layout-box">
                <div class="box-left"><slot name="left"></slot></div>
                <div class="box-right"><slot name="right"></slot></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            layoutNav: {
                type: String,
            }
        }
    }
</script>

<style scoped lang="less">
    .layout{
        height: 100%;
        border: 1px solid #d7dde4;
        background: #f0f0f7;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header{
        height: 50px;
        background-color: #fff;
    }
    .layout-content{
        height: calc(100% - 50px);
        padding: 0 20px 20px 20px;
    }
    .layout-nav{
        line-height: 40px;
        text-align: left;
        font-size: 14px;
        color: #474C63;
    }
    .layout-box{
        height: calc(100% - 40px);
        display: flex;

        .box-left{
            width: 45%;
            margin-right: 10px;
            background-color: #fff;
            overflow-y: auto;
        }
        .box-right{
            flex: 1;
            background-color: #fff;
            overflow-y: auto;
        }
    }
</style>
