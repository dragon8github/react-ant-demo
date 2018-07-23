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