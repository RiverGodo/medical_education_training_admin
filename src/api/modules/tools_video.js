import api from './config'
export function add_video(data) {
    return api.post('product/curriculum_online_catalog/add_video',data );
}
export const add_chapter = (data) => {
    return api.post('product/curriculum_online_catalog/add_chapter',data)
}
export function update_video(d) {
    return api.post('/product/curriculum_online_catalog/change',d);
}
