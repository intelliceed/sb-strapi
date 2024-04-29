// outsource dependencies
import qs from 'qs';

// local dependencies
import { Method } from '@/services/request/types';
import { Options, MergedOptionsType } from './types';
import { getStrapiURL } from '@/app/[lang]/utils/api-helpers';

export async function fetchAPI (
  path: string,
  options: Options = {}
) {
  const { headers = {}, body, params, ...attr } = options;

  try {
    const mergedOptions = buildRequestOptions(options);

    // Build request URL
    const requestUrl = buildRequestUrl(path, params);
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    return await response.json();

  } catch (error) {
    return error;
  }
}

function buildRequestOptions (options: Options) {
  const { headers = {}, body, ...attr } = options;

  const mergedOptions: MergedOptionsType = {
    method: Method.GET,
    next: { revalidate: 60 },
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...attr,
  };

  if ([Method.PUT, Method.POST, Method.DELETE].includes(attr?.method as Method)) {
    mergedOptions.body = JSON.stringify(body);
  }

  return mergedOptions;
}

function buildRequestUrl (path: string, params?: Record<string, unknown>) {
  const queryString = qs.stringify(params);
  return getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`);
}
