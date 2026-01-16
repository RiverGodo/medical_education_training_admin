import {get_sign} from '../../api/modules/ali_oss'
import axios from 'axios'
const ossHost = 'http://sfile.9mededu.com';

export default {
    data(){
        return{
            uploadConfig: {
                bucket: 'jhyl-static-file',
                dir: 'user_task',
                type: 1
            },
        }
    },
    methods: {
        handleGetassignKey(file_item) {
            var date = new Date(); //dscj-app,user_task
            date = date.toGMTString();
            const IMG_TYPE = 'image/jpeg'
            const IMG_NAME = 'ww.jpeg'
            get_sign(IMG_TYPE, date, this.uploadConfig.bucket, this.uploadConfig.dir, IMG_NAME, 'POST')
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
                console.log(this.img_url,'this.img_url');
                // this.$emit('upload', this.img_url)
            });
        },
    },
}