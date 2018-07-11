import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
// by hzy
export async function queryMyMenuData() {
  return request('/api/admin/res/sysRes/myMenus');
}
