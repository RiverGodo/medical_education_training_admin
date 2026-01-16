import api from './config'
export function get_offline_curriculum_list(d) {
    return api.post('/product/curriculum_offline/term_curriculum_get_list',d);
}
export function delete_offline_curriculum(curriculum_id) {
    return api.post('/product/curriculum_offline/term_curriculum_delete',{
      curriculum_underline_term_id:curriculum_id});
}
export function get_offline_term_list(d) {
    return api.post('/product/curriculum_offline/term_get_list',d);
}
export function select_add_term(select_term_id) {
    return api.post('product/curriculum_offline/term_delete',{
        select_term_id:select_term_id});
}
export function delete_offline_term(offline_term_id) {
    return api.post('/product/curriculum_offline/term_delete',{
      term_underline_id:offline_term_id});
}
export function get_offline_curriculum_detail(d){
  return api.post('/product/curriculum_offline/term_curriculum_get_list', d)
}
