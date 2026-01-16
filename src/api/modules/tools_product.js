import api from './config'
export function add_product(param) {
  let d = {
    organization_id: param.organization_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    category_id: param.category_id,
    model: param.model,
    duration: 0,
    validity_term_state: param.validity_term_state,
    evaluate_state: param.evaluate_state,
    validity_term_unit : param.validity_term_unit,
    qa_state: param.qa_state,
    validity_term_value: param.validity_term_value,
    product_evaluate: param.product_evaluate,
    enroll_condition_state: param.enroll_condition_state,
    enroll_condition: param.enroll_condition,
    enroll_agreement: param.enroll_agreement,
    study_mode: param.study_mode,
    study_count: param.study_count,
    barrage_state: param.barrage_state,
    warn_state: param.warn_state,
    warn_content: param.warn_content,
    validity_term_type: param.validity_term_type,
    all_validity_term_value: param.all_validity_term_value,
    will_sale_info: param.will_sale_info,
    play_page_template: param.play_page_template
  }
  return api.post('product/product/add', d);
}
export function update_product(param) {
  let d = {
    organization_id: param.organization_id,
    product_id: param.product_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    category_id: param.category_id,
    model: param.model,
    duration: 0,
    validity_term_state: param.validity_term_state,
    evaluate_state: param.evaluate_state,
    validity_term_unit : param.validity_term_unit,
    qa_state: param.qa_state,
    validity_term_value: param.validity_term_value,
    product_evaluate: param.product_evaluate,
    enroll_condition_state: param.enroll_condition_state,
    enroll_condition: param.enroll_condition,
    enroll_agreement: param.enroll_agreement,
    study_mode: param.study_mode,
    study_count: param.study_count,
    barrage_state: param.barrage_state,
    warn_state: param.warn_state,
    warn_content: param.warn_content,
    validity_term_type: param.validity_term_type,
    all_validity_term_value: param.all_validity_term_value,
    will_sale_info: param.will_sale_info,
    play_page_template: param.play_page_template
  }
  if(param.hasOwnProperty('edit_state')) d.edit_state = param.edit_state
  return api.post('/product/product/change', d);
}
export function get_product_info(id) {
  return api.post('product/product/getProductDetailById', {product_id:id})
}
