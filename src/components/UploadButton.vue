<template>
    <div contentEditable="false">
        <div v-if="imgtypes">
            <Button class="imgtypes-btn" v-if="imgtypes == 'close'" @click="handleClose" >{{text}}</button>
            <div v-else>
                <Button class="imgtypes-btn" @click='handleStartUploadFile' style="width: 80px;">{{text}}</button>
                <input type="file" ref="input" class="el-upload__input" @change="handleUploadChange" :accept="type">
            </div>
        </div>
        <div v-else class='el-upload__inner' contentEditable="false">
            <img v-if="iconType" :src="iconType" @click='handleStartUploadFile' style="cursor: pointer"/>
            <Button v-else type='primary' ghost @click='handleStartUploadFile'>{{text}}</Button>
            <input type="file" ref="input" class="el-upload__input" @change="handleUploadChange" :accept="type">
        </div>
    </div>
</template>
<script>
    import {get_sign} from '../api/modules/ali_oss'
    import {Config} from '../config/base'
    import axios from 'axios'
    const videoUrl = 'http://vfile.9mededu.com';
    const videoOssHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';

    export default {
        data() {
            return {
                fullscreenLoading: null,
                resultUrl: '',
                fileName: '',
                fileSize: null,
                maxSizes: '',
                isVideo: false
            }
        },
        props: {
            isShowProgress: {
                type: Boolean,
                default: false
            },
            imgtypes: [Number, String],
            type: {
                type: String,
                default: '*'
            },
            bucket: {
                type: String,
                default: 'jhyl-static-file'
            },
            dir: {
                type: String,
                default: 'wenda'
            },
            text: {
                type: String,
                default: '上传文件'
            },
            host: {
                type: String,
                default: Config.ossHost
            },
            iconType: {
                type: String,
                default: ''
            },
            uploadType: {
                type: Number
            },
            maxFileSize: [Number, Array]
        },
        methods: {
            handleStartUploadFile() {
                this.$refs.input.click();
            },
            handleClose(){
                this.$emit('handle-close')
            },
            maxFileSize2(filename){
                let fileType = filename.split(".")
                let fileType2 = fileType[fileType.length-1]
                if( fileType2 == 'jpg' || fileType2 == 'jpeg' || fileType2 == 'png'){
                    return this.maxFileSize[0]
                }else  return this.maxFileSize[1]
            },
            handleUploadChange(event) {
                this.isVideo = this.$config.checkVideo(event.target.files[0].type)
                var filename = event.target.value.substring(event.target.value.lastIndexOf("\\") + 1, event.target.value.length);
                this.fileName = filename;
                let maxFileSizes = Array.isArray(this.maxFileSize) ? this.maxFileSize2(filename) : this.maxFileSize
                this.maxSizes = maxFileSizes;
                this.fileSize = event.target.files[0].size / (1024 * 1024);
                if (maxFileSizes > 0 && this.fileSize > maxFileSizes) {
                    this.$Modal.info({
                        title: '提示',
                        content: `文件不能超过${maxFileSizes}M`,
                        onOk: () => {
                        }
                    });
                    return;
                }
                if(this.isShowProgress) this.fullscreenLoading = this.$emit('open-load', {message: `已上传0%`, show: true})
                else this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
                // if(this.handleCheckMedia(event))  this.handleGetassignKey(event.target.files[0]);
                this.handleGetassignKey(event.target.files[0]);
            },
            handleUploadFile(formData, url, headers) {
                // TODO 上传到OSS上
                let vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: formData,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                        if(vm.isShowProgress) vm.fullscreenLoading = vm.$emit('open-load', {message: `已上传${progress}%`, show: true})
                    },
                }).then(res => {
                    const RES_URL = this.isVideo ? videoUrl : url
                    this.resultUrl = RES_URL + '/' + this.resultUrl;
                    this.$emit('uploadcomplete', {name: this.fileName, url: this.resultUrl, maxSizes: this.maxSizes == 2 ? 'img' : this.maxSizes == 300 ? 'video' : ''  });
                    if(this.isShowProgress&&this.fullscreenLoading) {
                        this.$emit('open-load', {message: '', show: false})
                        this.fullscreenLoading = null
                    }else this.loadingInstance.close()
                    var f = this.$refs.input;
                    if (f.value) {
                        var form = document.createElement('form'), ref = f.nextSibling;
                        form.appendChild(f);
                        form.reset();
                        if (ref && ref.parentNode) ref.parentNode.insertBefore(f, ref);
                    }
                });
            },
            handleGetassignKey(fileItem) {
                console.log(fileItem,'fileItem')
                var date = new Date();
                date = date.toGMTString();
                get_sign(fileItem.type, date, this.bucket, this.dir, fileItem.name, 'POST').then(res => {
                    if (res.data.res_code == 1) {
                        const formData = new FormData();
                        this.resultUrl = res.data.data.filename;
                        formData.append('key', res.data.data.filename);
                        formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                        formData.append('success_action_status', '200');
                        formData.append('signature', res.data.data.sign);
                        formData.append('policy', res.data.data.policyBase64);
                        formData.append('file', fileItem);
                        this.handleUploadFile(
                            formData,
                            encodeURI(this.isVideo ? videoOssHost : this.host)
                        );
                    }
                })
            }
        },
    }
</script>
<style>
    .imgtypes-btn{
        width: 120px;
        height: 36px;
        background: #fff;
        color: #3DAAFF;
        border: 1px solid #3DAAFF;
    }
</style>

