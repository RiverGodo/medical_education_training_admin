export function doGroupSlice(numPerRow, data) {
    var result = [];
    for (var i = 0; i < data.length; i += numPerRow) {
        result.push(data.slice(i, i + numPerRow))
    }
    return result;
}

export function doTimeFormat(val) {
    if (val) {
        if (val == "0000-00-00 00:00:00") {
            return "不限期";
        }
        var date = new Date(val);
        var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        return date.getFullYear() + '-' + monthStr + '-' + dateStr;
    } else return ""
}

export function doDateFormat(val) {
    var date = new Date(val);
    var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    var hourStr = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    var miniteStr = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return date.getFullYear() + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + miniteStr;
}

export function doOfflineCurriculumTypeFormat(val) {
    switch (val) {
        case 1: return '讲座';
        case 2: return '实践';
    }
}

export function doSortFormatCatalogList(list) {
    if (list.length === 0)
        return [];

    var groupList = [];
    var i, j;
    var existGroup;
    for (i = 0; i < list.length; i++) {
        existGroup = false;
        for (j = 0; j < groupList.length; j++) {
            if (list[i].group_orderby === groupList[j].group_orderby) {
                existGroup = true;
                groupList[j].classList.push(list[i]);
                break;
            }
        }
        if (!existGroup) {
            groupList.push({
                curriculum_id: list[i].curriculum_id,
                group_orderby: list[i].group_orderby,
                group_name: list[i].group_name,
                classList: [list[i]]
            });
        }
    }

    for (i = 0; i < groupList.length; i++) {
        groupList[i].classList.sort(function (a, b) {
            if (a.orderby < b.orderby)
                return -1;
            else if (a.orderby > b.orderby)
                return 1;
            return 0;
        });
    }

    groupList.sort(function (a, b) {
        if (a.group_orderby < b.group_orderby)
            return -1;
        else if (a.group_orderby > b.group_orderby)
            return 1;
        return 0
    });

    return groupList;
}

export function cleanHtmlLabel(val) {
    return val.replace("<[^>]*>", "");
}

import json2csv from 'json2csv'

export function exportCsv(data, fields, fileNames, fileName) {
    try {
        var result = json2csv({ data: data, fields: fields, fieldNames: fileNames });
        var csvContent = "data:text/csv;charset=GBK,\uFEFF" + result;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${(fileName || 'file')}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
        document.body.removeChild(link); // Required for FF

    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
}

export function reunitPrice(val) {
    return (val).toString();
}
export const MenuToturList = [
    {
        name: 'tutor-course',
        title: '课程管理',
        icon: 'md-school',
    },
    {
        name: 'questions-answers',
        title: '问答管理',
        icon: 'md-chatboxes',
    },
]
export const OperationManagement = {
    name: 'operation-management',
    title: '运营管理',
    icon: 'md-pricetag',
    list: [
        {
            name: 'barrage-management',
            title: '弹幕管理',
        },
        {
            name: 'zone-management',
            title: '圈子管理',
        },
    ]
}

export const MenuList = [
    {
        name: 'user-manage',
        title: '用户管理',
        icon: 'logo-octocat',
    },
    {
        name: 'product-manage',
        title: '培训管理',
        icon: 'md-school',
        list: [
            {
                name: 'product-manage',
                title: '产品'
            },
            {
                name: 'production-intersection',
                title: '产品合集'
            },
            {
                name: 'live-course',
                title: '直播课'
            },
        ]
    },
    {
        name: 'exchange-code',
        title: '兑换码管理',
        icon: 'md-clipboard',
    },
    {
        name: 'order',
        title: '统计管理',
        icon: 'md-pricetag',
        list: [
            {
                name: 'order-management',
                title: '课程订单',
            },
            {
                name: 'invoice-info',
                title: '发票列表',
            },
            // {
            //     name: 'certificate-info',
            //     title: '证书信息',
            // },
        ]
    },
    {
        // name: 'private-letter',
        // title: '私信管理',
        // icon: 'md-chatboxes',
        name: 'private-letter-manage',
        title: '私信管理',
        icon: 'md-pricetag',
        list: [
            {
                name: 'system-private-letter',
                title: '系统私信',
            },
            // {
            //     name: 'user-private-letter',
            //     title: '用户私信',
            // },
            {
                name: 'say-hi-template',
                title: 'sayhi 模板',
            }
        ]
    },
    {
        name: 'system-manage',
        title: '平台管理',
        icon: 'md-planet',
        list: [
            {
                name: 'advertising-map',
                title: '广告图'
            },
            {
                name: 'recommended-products',
                title: '推荐产品'
            },
            {
                name: 'open-class',
                title: '公开课'
            },
            {
                name: 'manage-news',
                title: '行业资讯'
            },
            {
                name: 'notification-chat',
                badge: true,
                title: '通知管理',
            },
            {
                name: 'pop-up-notification',
                // badge: true,
                title: '弹窗通知',
            },
            {
                name: 'instructions',
                title: '使用说明'
            }
        ]
    },
    {
        name: 'data-management',
        title: '数据管理',
        icon: 'md-chatboxes',
    },
    {
        name: 'note-management',
        title: '笔记管理',
        icon: 'md-chatboxes',
    }
]
