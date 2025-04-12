import request from '@/utils/request'

export const loginAPI = obj => {
  return request.post('/auth/login', obj)
}

export const getUserAPI = () => {
  return request.get('/auth/currentUser')
}

export const getLineAPI = () => {
  return request.get('/analysis/DailyVisitTrend')
}
