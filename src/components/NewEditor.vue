<template>
    <div ref="NewEditorBox" class="box">
        <div :id="editorId" class="h100"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import E from './wangEditor'
    import {get_sign} from '../api/modules/ali_oss'
    const videoOssHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';
    const ossHost = 'http://sfile.9mededu.com';
    export default {
        name: "NewEditor",
        data() {
            return {
                editorHtml: null,
                resourse_url: '',
                res_url: '',
                host: 'http://sfile.9mededu.com',
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                editor: '',
                fileSize: null,
            }
        },
        props: {
            isUploadVideo: { // 是否上传视频
                type: Boolean,
                default: false
            },
            content: {
                type: String,
                default: ''
            },
            editorId: {
                type: String,
                default: 'div'
            }
        },
        watch: {
            content(val) {
                this.editor.txt.html(val)
            }
        },
        beforeDestroy() {
            this.setEditor = null;
            this.handleUploadFile = null;
            this.handleGetassignKey = null;
            this.resourse_url = ''
        },
        methods: {
            handleUploadFile(form_data, url, types) {
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
                    this.res_url = url + '/' + this.resourse_url;
                    if(types == 'img'){
                        var s = document.getSelection()
                        var range = s.getRangeAt(0)
                        range.deleteContents()
                        var img = document.createElement("img")
                        img.src = this.res_url
                        img.style.maxWidth = '100%'
                        range.insertNode(img)
                    }
                    if(types == 'video'){
                        this.editor.cmd.do(
                            'insertHTML', 
                            `<video style="width: 100%;" controls="controls" src="${this.res_url}"></video><p><br/></p>`
                        )
                    }
                    this.editor.change && this.editor.change()
                    console.log(s,'insertNodeinsertNode', range)
                });
            },
            handleGetassignKey(file_item, types) {
                if (file_item) {
                    if(types == 'img'){
                        this.fileSize = file_item.size / (1024 * 1024);
                        if (this.fileSize > 2) {
                            this.$Modal.info({
                                title: '提示',
                                content: `文件不能超过2M`,
                                onOk: () => {
                                }
                            });
                            return;
                        }
                    }
                    var date = new Date();
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
                                this.handleUploadFile(formData, encodeURI(types == 'video' ? videoOssHost : ossHost), types);
                            }
                        })
                }
            },
            selectText() {
                if (document.Selection) {
                    //ie浏览器
                    return document.selection.createRange().text;
                } else {
                    //标准浏览器
                    return window.getSelection().toString();
                }
            },
            handlePos(v, p2) {
                let p1 = v.indexOf('font-size');
                if (p1 < p2) return true
                return false
            },
            handleSize(v, pos) {
                if (this.handlePos(v, pos)) {
                    if (v.includes('x-small')) return 12
                    else if (v.includes('small')) return 13
                    else if (v.includes('xx-large')) return 32
                    else if (v.includes('x-large')) return 24
                    else if (v.includes('large')) return 18
                    else return 16
                }
                return 16
            },
            setEditor: function () {
                let vm = this
                this.editorHtml = this.content;
                this.editor = new E(`#${this.editorId}`)
                let menus = ['fontSize', 'bold', 'underline', 'foreColor', 'image', 'justify', 'list']
                if(this.isUploadVideo) menus.splice(5, 0, 'video')
                this.editor.customConfig.menus = menus
                this.editor.customConfig.customUploadImg = function (files, insert) {
                    // vm.handleGetassignKey(files[0], insert)
                }
                this.editor.customConfig.onchange = function (html) {
                    console.log(html, 'HHHH');
                    console.log(window.getSelection(),'KMKM');
                    vm.$emit('editor-change', html)
                }
                // this.editor.customConfig.pasteFilterStyle = true
                this.editor.customConfig.pasteTextHandle = function (content) {
                    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                    // return `<div style="font-size: 16px;">${content}</div>`
                    if (content == '' && !content) return ''
                    var str = content
                    str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
                    str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
                    str = str.replace(/<\/?[^>]*>/g, '')
                    str = str.replace(/[ | ]*\n/g, '\n')
                    str = str.replace(/&nbsp;/ig, '')
                    return `<div style="font-size: 16px;color:#000;">${str}</div>`
                }
                this.editor.customConfig.showLinkImg = false
                this.editor.customConfig.showLinkVideo = false
                this.editor.customConfig.uploadVideoAccept = ['mp4'];
                this.$refs.NewEditorBox.addEventListener('mouseleave', function () {
                    // let text = vm.editorHtml ? vm.editorHtml : vm.content
                    vm.$emit('get-content', vm.editor.txt.html())
                })
                let doc = document.getElementById(this.editorId)
                //插入图片
                doc.onclick = function () {
                    var upload = document.querySelector('.upload-input')
                    upload.addEventListener('change', function (e) {
                        vm.handleGetassignKey(e.target.files[0], 'img')
                        upload.value = null
                    })
                    let uploadVideo = document.querySelector('.wangeditor-upload-input-video')
                    uploadVideo.addEventListener('change', function (e) {
                        vm.handleGetassignKey(e.target.files[0], 'video')
                        uploadVideo.value = null
                    })
                }
                doc.onmousemove = function () {
                    let html1 = null
                    let text = vm.editor.txt.html()
                    if (document.Selection) {
                        //ie浏览器
                        html1 = document.selection.createRange().text;
                    } else {
                        //标准浏览器
                        html1 = window.getSelection().toString();
                    }
                    if (text.includes(html1)) {
                        let d = text.split('span')
                        let arr = []
                        d.forEach((v, i) => {
                            if (v.includes(html1)) {
                                if (v.includes('font-size')) {
                                    arr.push(vm.handleSize(v, v.indexOf(html1)))
                                } else {
                                    arr.push(16)
                                }
                            }
                        });
                        let docs = document.querySelectorAll('.w-e-menu .w-e-droplist .w-e-list')[0] && document.querySelectorAll('.w-e-menu .w-e-droplist .w-e-list')[0].childNodes
                        if (docs) {
                            docs.forEach((t) => {
                                t.style.color = '#474C63'
                                if (arr.length == 1) {
                                    if (arr[0] == t.innerText) {
                                        t.style.color = '#4098FF'
                                    }
                                } else {
                                    if (t.innerText == 16) {
                                        t.style.color = '#4098FF'
                                    }
                                }
                            })
                        }
                    }
                };
                this.editor.customConfig.zIndex = 0
                this.editor.customConfig.colors = ['#000000', '#eeece0', '#1c487f', '#4d80bf', '#c24f4a',
                    '#8baa4a', '#7b5ba1', '#46acc8', '#f9963b', '#FF0000']
                this.editor.create()
                this.editor.txt.html(this.content)
            }
        },
        mounted() {
            this.setEditor()
            document.querySelector('.upload-input').accept = "image/jpeg,image/png,image/jpg"
        },
    }
</script>

<style scoped>
    .box {
        min-width: 400px;
    }

    .h100 {
        height: 100%;
        font-size: 16px
    }

    /deep/ .w-e-text-container {
        height: calc(100% - 44px) !important;
        overflow: hidden;
        position: initial;
        overflow-y: auto !important;
        /*height: auto !important;*/
    }

    /deep/ .w-e-panel-container {
        top: 42px;
    }

    /deep/ .upload-input, /deep/ .wangeditor-upload-input-video {
        width: 36px;
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        z-index: 1;
        filter: alpha(opacity=0);
    }
</style>
