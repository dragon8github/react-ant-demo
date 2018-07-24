import { stringify } from 'qs';
import request from '../utils/request';

export async function searchOgpApplyWorkList(params) {
  return request(`/api/ogp/applyWorkList/ogpApplyWorkList/search?${stringify(params)}`);
}
export async function getOgpApplyWorkList(params) {
  return request(`/api/ogp/applyWorkList/ogpApplyWorkList/` + params);
}
export async function saveOgpApplyWorkList(params) {
  return request(`/api/ogp/applyWorkList/ogpApplyWorkList`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpApplyWorkList(params) {
  return request(`/api/ogp/applyWorkList/ogpApplyWorkList/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}