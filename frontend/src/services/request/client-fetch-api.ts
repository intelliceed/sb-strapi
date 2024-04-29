// local dependencies
import { Options } from './types';
import { fetchAPI } from '@/services/request/fetch-api';
import { SessionData } from '@/app/constants/iron-session';

async function fetchJson<JSON = unknown> (
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    ...init,
  }).then((res) => res.json());
}

export async function clientFetchApi (path: string, options: Options) {
  const { jwt } = await fetchJson<SessionData>('/api/auth/iron-session');

  if (jwt) {
    if (options.headers) {
      options.headers.Authorization = `Bearer ${jwt}`;
    } else {
      options.headers = {
        Authorization: `Bearer ${jwt}`
      };
    }
  }

  return await fetchAPI(path, options);
}
