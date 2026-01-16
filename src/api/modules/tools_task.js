import api from './config'
export function get_category_list(page, keyword, type) {
    let id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
    return api.post('/product/homework/get_list',{
        product_id:id,
        page_size: page.page_size,
        page_num: page.page_num,
        search: keyword,
        type: type
    });
}
export function create_category(params) {
    return api.post('/product/homework/add',{
        title:params.realname,
        type:params.jurisdiction,
        item_id:params.binding_course,
        description:params.description,
        attachment_url:JSON.stringify(params.downList)
    });
}
export function edit_category_by_id(homworkId,params) {
    return api.post('/product/homework/change',{
        homework_id:homworkId,
        title:params.realname,
        type:params.jurisdiction,
        curriculum_id:params.binding_course,
        description:params.description,
        attachment_url:JSON.stringify(params.downList)
    });
}
export function delete_task_by_id(homework_id) {
    return api.post('/product/homework/delete',{homework_id});
}
export function get_curriculumlist_online(params) {
    let id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
    return api.post('/product/curriculum_online/get_list',{
        product_id:id,
        page_size:998,
        page_num:1,
    });
}
export function save_datalist(params) {
    return api.post('/product/data/add',{
        title: params.name,
        item_id: params.subject_id,
        attachment_url: params.download_url,
        state: 1
    })
}
