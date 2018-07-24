import { stringify } from 'qs';
import request from '../utils/request';

export async function searchOgpDeclareCompany(params) {
  return request(`/api/example/company/ogpDeclareCompany/search?${stringify(params)}`);
}
export async function getOgpDeclareCompany(params) {
  return request(`/api/example/company/ogpDeclareCompany/` + params);
}
export async function saveOgpDeclareCompany(params) {
  return request(`/api/example/company/ogpDeclareCompany`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpDeclareCompany(params) {
  return request(`/api/example/company/ogpDeclareCompany/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}