import api from './config'
export function add_test_detail(data) {
    return api.post('/product/curriculum_online_catalog/add_test',data);
}
export function update_test_detail(data) {
    return api.post('product/curriculum_online_catalog/change_video_test',{
      title: data.title,
      video_test_detail_id: data.video_test_detail_id,
      content: data.content,
      select_count: data.select_count,
      result: data.result,
      test_title: data.test_title,
      catalog_id:data.catalog_id,
      section_id:data.section_id,
      answerList:data.answerList,
      attachment:data.attachment,
      unlock_time:data.unlock_time,
      unlock_type:data.unlock_type,
    });
}
export function delete_test_detail(test_detail_id) {
    return api.post('/product/curriculum_online_catalog/delete',{
        test_detail_id:test_detail_id
    });
}
