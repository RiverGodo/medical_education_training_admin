import Vue from 'vue';
import addCourseDialog from './addCourseDialog.vue';
import addDownloadDataDialog from './addDownloadDataDialog.vue';
import addProductionDialog from './addProductionDialog.vue';
import addQuestionDialog from './addTestContentDialog.vue';
import addOfflineSemesterDialog from './addOfflineSemesterDialog'
import addHouner from './addHouner.vue';

import videoManageDialog from './videoManageDialog.vue';
import sendOfflineCourse from './sendOfflineCourse.vue';

import sendHouner from './sendHouner.vue';
import readOver from './readOver.vue';
import store from '../../store';
import {RemoveModal} from './mixins'

export var Dialog = {
    mixins: [RemoveModal],
    mounted() {
        this.handleRemoveModal('send-houner-container')
    },
    methods: {
        handleSelModal(el_name, payload) {
            let inits = (com) => {
                return  initVue({
                    el_name,
                    payload,
                    component: com
                })
            }
            switch (el_name) {
                case 'add-course':
                    inits(addCourseDialog);
                    break;
                case 'add-question':
                    inits(addQuestionDialog);
                    break;
                case 'add-offline-semester':
                    inits(addOfflineSemesterDialog);
                    break;
                case 'video-manage':
                    inits(videoManageDialog);
                    break;
                case 'send-offline-course':
                    inits(sendOfflineCourse);
                    break;
                case 'add-download-data':
                    inits(addDownloadDataDialog);
                    break;
                case 'add-production':
                    inits(addProductionDialog);
                    break;
                case 'add-houner':
                    inits(addHouner);
                    break;
                case 'send-houner':
                    inits(sendHouner);
                    break;
                case 'read-over':
                    inits(readOver);
                    break;
            }
        }
    }
}
function initVue({ el_name, payload, component}) {
    var element = document.createElement('div');
    element.id = `${el_name}-container`;
    element.innerHTML = `<${el_name}-dialog :remove='removeNodeName' :payload='childPayload'></${el_name}-dialog>`;
    Vue.component(`${el_name}-dialog`, component);
    document.getElementById('app').appendChild(element);
    new Vue({
        data: {
            removeNodeName: element.id,
            childPayload: payload
        },
        store
    }).$mount(element);
}
