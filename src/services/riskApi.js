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

export async function searchOgpWarningCallUser(params) {
  return request(`/api/ogp/risk/ogpWarningCallUser/search?${stringify(params)}`);
}
export async function getOgpWarningCallUser(params) {
  return request(`/api/ogp/risk/ogpWarningCallUser/` + params);
}
export async function saveOgpWarningCallUser(params) {
  return request(`/api/ogp/risk/ogpWarningCallUser`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpWarningCallUser(params) {
  return request(`/api/ogp/risk/ogpWarningCallUser/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}


export async function searchOgpWarningCall(params) {
  return request(`/api/ogp/risk/ogpWarningCall/search?${stringify(params)}`);
}
export async function getOgpWarningCall(params) {
  return request(`/api/ogp/risk/ogpWarningCall/` + params);
}
export async function saveOgpWarningCall(params) {
  return request(`/api/ogp/risk/ogpWarningCall`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpWarningCall(params) {
  return request(`/api/ogp/risk/ogpWarningCall/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}

export async function searchOgpWarningRule(params) {
  return request(`/api/ogp/risk/ogpWarningRule/search?${stringify(params)}`);
}
export async function getOgpWarningRule(params) {
  return request(`/api/ogp/risk/ogpWarningRule/` + params);
}
export async function saveOgpWarningRule(params) {
  return request(`/api/ogp/risk/ogpWarningRule`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpWarningRule(params) {
  return request(`/api/ogp/risk/ogpWarningRule/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}