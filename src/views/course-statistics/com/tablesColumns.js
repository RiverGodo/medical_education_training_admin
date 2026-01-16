import TableExpand from './table-expand.vue'
let isNaN = (d) => {
    return d != 'NaN%' ? d : '0%'
}
export default [
    [   
        {
            title: '序号',
            key: 'serialNum',
            minWidth: 70
        },
        {
            title: '用户ID',
            key: 'username',
            align: 'left',
            minWidth: 100
        }, {
            title: '真实姓名',
            key: 'realname',
            minWidth: 100
        },
        {
            title: '学科',
            key: 'department_name',
            align: 'left',
            minWidth: 100,
        },
        {
            title: '批次',
            key: 'batch',
            minWidth: 120,
        },
        {
            title: '进度',
            key: 'rate',
            minWidth: 150
        },
        {
            title: '答题正确率',
            key: 'test_rate',
            minWidth: 150,
        },
        {
            title: '操作',
            minWidth: 200,
            slot: 'operation',
            operation_btn_hide: false,
            align: 'left',
            operation: [
                ['查看详情', 'operation1'],
            ]
        }
    ],
    [
        {
            title: '课程名称',
            key: 'title',
            align: 'left',
            minWidth: 100
        },
        {
            title: '课程完成率',
            key: 'rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.rate))
            },
        },
        {
            title: '答题正确率',
            key: 'test_rate',
            align: 'left',
            minWidth: 100
        },
        {
            title: '评价平均分（10分制）',
            key: 'averageScore',
            minWidth: 100,
            render: (h, params) => {
                return h('span', params.row.averageScore == "NaN" ? 0 : params.row.averageScore/10)
            },
        }
    ],
    [
        {
            title: '作业名称',
            key: 'title',
            align: 'left',
            minWidth: 100
        },
        {
            title: '提交人数',
            key: 'submit_count',
            minWidth: 100
        },
        {
            title: '完成率',
            key: 'rate',
            align: 'left',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.rate))
            },
        },
        {
            title: '平均分（100分制）',
            key: 'averageScore',
            minWidth: 100,
            render: (h, params) => {
                return h('span', params.row.averageScore == "NaN" ? 0 : params.row.averageScore)
            },
        },
        {
            title: '操作',
            minWidth: 200,
            slot: 'operation',
            operation_btn_hide: false,
            align: 'left',
            operation: [
                ['查看详情', 'operation1'],
            ]
        }
    ],
    [
        {
            title: '课程名称',
            key: 'title',
            align: 'left',
            minWidth: 100
        },
        {
            title: '参与率',
            key: 'sign_rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.sign_rate))
            },
        },
        {
            title: '完成率',
            key: 'complete_rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.complete_rate))
            },
        },
        {
            title: '回放率',
            key: 'playback_rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.playback_rate))
            },
        }
    ],
    [
        {
            title: '课程名称',
            key: 'title',
            align: 'left',
            width: 300
        },
        {
            title: '期数',
            key: 'term_count',
            width: 120
        },
        {
            title: '签到率',
            key: 's_rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.s_rate))
            },
        },
        {
            title: '完成率',
            key: 'c_rate',
            minWidth: 100,
            render: (h, params) => {
                return h('span', isNaN(params.row.c_rate))
            },
        },
        {
            title: '平均分',
            key: 'average_score',
            minWidth: 100,
            render: (h, params) => {
                return h('span', params.row.average_score == "NaN" ? 0 : params.row.average_score)
            },
        },
        {
            title:'操作',
            key:'',
            minWidth: 100,
            slot: 'listExpand',
            type: 'expand',
            render: (h, params) => {
                let d = params.row.terms;
                return  h(TableExpand, {  props: { details: d } })
            }
        },
    ]
]