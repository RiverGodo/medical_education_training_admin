import api from './config'
export default (data) => {
    return api.post('/product/curriculum_online_catalog/changeChapter',{...data});
}
