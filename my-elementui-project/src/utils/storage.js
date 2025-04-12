const KEY = 'mj-pc-token'

// 获取
export const getToken = () => {
  return localStorage.getItem(KEY)
}

// 设置
export const setToken = (newToken) => {
  return localStorage.setItem(KEY, newToken)
}

// 删除
export const delToken = () => {
  return localStorage.removeItem(KEY)
}
