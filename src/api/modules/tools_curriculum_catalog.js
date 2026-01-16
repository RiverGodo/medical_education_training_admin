import api from './config'
export function delete_catalog(catalog_id) {
    return api.post('/product/curriculum_online_catalog/delete',{
        curriculum_catalog_id: catalog_id
    });
}
export function get_catalog(curriculum_online_id) {
    return api.post('product/curriculum_online_catalog/get_list',curriculum_online_id);
}