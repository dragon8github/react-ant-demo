import { stringify } from 'qs';
import request from '../utils/request';

export async function searchOgpRiskInfo(params) {
  return request(`/api/ogp/risk/ogpRiskInfo/search?${stringify(params)}`);
}
export async function getOgpRiskInfo(params) {
  return request(`/api/ogp/risk/ogpRiskInfo/` + params);
}
export async function saveOgpRiskInfo(params) {
  return request(`/api/ogp/risk/ogpRiskInfo`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpRiskInfo(params) {
  return request(`/api/ogp/risk/ogpRiskInfo/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}

export async function searchOgpRiskReport(params) {
  return request(`/api/ogp/risk/ogpRiskReport/search?${stringify(params)}`);
}
export async function getOgpRiskReport(params) {
  return request(`/api/ogp/risk/ogpRiskReport/` + params);
}
export async function saveOgpRiskReport(params) {
  return request(`/api/ogp/risk/ogpRiskReport`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpRiskReport(params) {
  return request(`/api/ogp/risk/ogpRiskReport/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}


export async function searchOgpPipeInfo(params) {
  return request(`/api/ogp/risk/ogpPipeInfo/search?${stringify(params)}`);
}
export async function getOgpPipeInfo(params) {
  return request(`/api/ogp/risk/ogpPipeInfo/` + params);
}
export async function saveOgpPipeInfo(params) {
  return request(`/api/ogp/risk/ogpPipeInfo`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpPipeInfo(params) {
  return request(`/api/ogp/risk/ogpPipeInfo/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}