export const columnSee = [
    {title: '选项', type: 'selection', width: 100},
    {title: '课程名称', key: 'curriculum_title', minWidth: 260, align: 'left'},
    {
        title: '类型', key: '', minWidth: 100,
        render: (h, params) => {
            let d = params.row.curriculum_type == 1 ? '讲座' : '实践'
            return h('span', d)
        }
    },
    {title: '签到状态', key: 'state', minWidth: 100, align: 'left',
        render: (h, params) => {
            let d = params.row.state ? '已签到' : '未签到' 
            let color = params.row.state ? '#2EBF07' : '#F54802'
            return h('span',{ style: { color } }, d)
        }
    },
    {
        title: '评分', key: '', minWidth: 100,
        render: (h, params) => {
            return h('span', params.row.score || 0 + '分')
        }
    },
];
export const columnBatchScore = [
    {title: '选项', type: 'selection', width: 100},
    {title: '姓名', key: 'user_realname', minWidth: 100},
    {title: '用户ID', key: 'user_username', minWidth: 100},
    {title: '签到状态', key: 'state', minWidth: 180,
        render: (h, params) => {
            let d = params.row.state ? '已签到' : '未签到' 
            let color = params.row.state ? '#2EBF07' : '#F54802'
            return h('span',{ style: { color } }, d)
        }
    },
    {
        title: '评分', key: '', minWidth: 100,
        render: (h, params) => {
            return h('span', params.row.score || 0 + '分')
        }
    },
    { title: '已完成', key: 'state', stateKey: 'curriculum_finish', minWidth: 100,
        render: (h, params) => {
            return h('span', params.row.curriculum_finish+'/'+params.row.curriculum_all )
        }
    }
]