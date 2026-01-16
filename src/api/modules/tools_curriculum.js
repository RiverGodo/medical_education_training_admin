import api from './config'
export function get_list(page, keyword) {
    let id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
    return api.post('product/curriculum_online/get_list',{
        product_id: id,
        page_size: page.page_size,
        page_num: page.page_num,
        keyword: keyword
    });
}
export function add_curriculum(data) {
    let id = JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id
    return api.post('product/curriculum_online/add', {
      product_id: id,
      title: data.title,
      teacher_id: data.teacher_id,
      department_id: (data.department_id === 'all' || !data.department_id ) ? null : data.department_id,
      grade_id: (data.grade_id === 'all' || !data.grade_id) ? null : data.grade_id,
      state: data.state,
      description: data.description,
      img_url: data.img_default,
      unlock_type: data.unlock_type,
      instructor_id: data.instructor_id,
      catalog_show_type: data.catalog_show_type,
      evaluate_state: data.evaluate_state,
      curriculum_evaluate: data.curriculum_evaluate,
      edit_state: data.edit_state
    })
}
export function update_curriculum(data) {
    return api.post('product/curriculum_online/change',{
        curriculum_online_id:data.id,
        title:data.title,
        teacher_id: data.teacher_id,
        department_id: (data.department_id === 'all' || !data.department_id ) ? null : data.department_id,
        grade_id: (data.grade_id === 'all' || !data.grade_id) ? null : data.grade_id,
        state: data.state,
        description: data.description,
        img_url: data.img_default,
        unlock_type: data.unlock_type,
        instructor_id: data.instructor_id,
        catalog_show_type: data.catalog_show_type,
        evaluate_state: data.evaluate_state,
        curriculum_evaluate: data.curriculum_evaluate,
        edit_state: data.edit_state,
        product_id: data.product_id
    });
}
export function delete_curriculum(id) {
    return api.post('product/curriculum_online/delete',{
      curriculum_online_id:id});
}
export function change_curriculum_list(id, direction) {
    return api.post('product/curriculum_online_catalog/move', {catalog_id: id, direction})
}
