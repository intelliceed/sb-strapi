// local dependencies
import { Options } from '@/services/request/types';
import { fetchAPI } from '@/services/request/fetch-api';
import { getSession } from '@/app/api/auth/iron-session/route';

export async function serverFetchApi (path: string, options: Options) {
  const { jwt } = await getSession();

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
