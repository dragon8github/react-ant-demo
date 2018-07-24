import { stringify } from 'qs';
import request from '../utils/request';


export async function searchOgpPipelineFoundation(params) {
  return request(`/api/ogp/opm/ogpPipelineFoundation/search?${stringify(params)}`);
}
export async function getOgpPipelineFoundation(params) {
  return request(`/api/ogp/opm/ogpPipelineFoundation/` + params);
}
export async function saveOgpPipelineFoundation(params) {
  return request(`/api/ogp/opm/ogpPipelineFoundation`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpPipelineFoundation(params) {
  return request(`/api/ogp/opm/ogpPipelineFoundation/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}

export async function searchOgpPatrolTask(params) {
  return request(`/api/ogp/opm/ogpPatrolTask/search?${stringify(params)}`);
}
export async function getOgpPatrolTask(params) {
  return request(`/api/ogp/opm/ogpPatrolTask/` + params);
}
export async function saveOgpPatrolTask(params) {
  return request(`/api/ogp/opm/ogpPatrolTask`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpPatrolTask(params) {
  return request(`/api/ogp/opm/ogpPatrolTask/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}

export async function searchOgpPatrolPlan(params) {
  return request(`/api/ogp/opm/ogpPatrolPlan/search?${stringify(params)}`);
}
export async function getOgpPatrolPlan(params) {
  return request(`/api/ogp/opm/ogpPatrolPlan/` + params);
}
export async function saveOgpPatrolPlan(params) {
  return request(`/api/ogp/opm/ogpPatrolPlan`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}
export async function removeOgpPatrolPlan(params) {
  return request(`/api/ogp/opm/ogpPatrolPlan/remove`, {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded;',
    body: params,
  });
}