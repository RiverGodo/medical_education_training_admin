<template>
    <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com"
            :format="['jpg','jpeg','png']" :data="uploadData"
            accept="image/jpeg,image/png,image/jpg,image/bmp"
            :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
        <slot name="picture" v-if="!img_url"></slot>
        <img v-else="img_url" :src="img_url" :style="imgStyle"/>
    </Upload>
</template>

<script>
    import {get_sign} from '../api/modules/ali_oss'
    import axios from 'axios'
    const ossHost = 'http://sfile.9mededu.com';

    export default {
        data() {
            return {
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                maxFileSize: 5,
                img_url: '',
                uploadData: {},

            }
        },
        props: {
            imgStyle: Object
        },
        methods: {
            handleBeforeUpload(file) {
                this.fileSize = file.size / (1024 * 1024);
                if (this.maxFileSize > 0 && this.fileSize > this.maxFileSize) {
                    this.$Modal.info({
                        title: '提示',
                        content: '文件过大',
                        onOk: () => {
                        }
                    });
                    return;
                }
                this.handleGetassignKey(file);
                return false
            },
            handleGetassignKey(file_item, insert) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost));
                        }
                    })
            },
            // 上传到oss上
            handleUploadFile(form_data, url) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.img_url = url + '/' + this.resourse_url;
                    this.$emit('upload', this.img_url)
                });
            },
            handleFormatError() {
                this.$Message.warning('请上传图片');
            }
        }
    }
</script>

<style scoped lang="less">
    .upload-flie-img {
        width: 40px;
        height: 35px;
    }
    .upload-flie-img-2 {
        width: 150px;
        height: 150px;
        border-radius: 100px
    }
</style>
