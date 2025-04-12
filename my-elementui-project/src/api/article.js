import request from '@/utils/request'

export const getArticleList = params => {
  return request({
    url: '/admin/interview/query',
    params
  })
}

export const createArticle = data => {
  return request.post('/admin/interview/create', data)
}

export const removeArticle = id => {
  return request.delete('/admin/interview/remove', {
    data: { id }
  })
}

export const getArticleDetail = id => {
  return request.get('/admin/interview/show', { params: { id } })
}

export const updateArticle = ({ id, stem, content }) => {
  return request.put('/admin/interview/update', { id, stem, content })
}
