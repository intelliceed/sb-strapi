// local dependencies
import { serverFetchApi } from '@/services/request/server-fetch-api';

export async function getPageBySlug (slug: string, lang: string) {
  return await serverFetchApi('/pages', {
    params: {
      locale: lang,
      filters: { slug },
    }
  });
}
