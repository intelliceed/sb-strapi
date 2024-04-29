// local dependencies
import { Debug } from '@/app/[lang]/components/Debug';
import { serverFetchApi } from '@/services/request/server-fetch-api';

async function getArticlesRelatedToEmail () {
  return serverFetchApi('/articles', {
    params: {
      filters: {
        authors: {
          email: {
            $eq: 'strapiuser1@gmai.com'
          }
        }
      }
    }
  });
}

export default async function PossibleRequests () {
  const articlesRelatedToEmail = await getArticlesRelatedToEmail();
  return <>
    <Debug articlesRelatedToEmail={articlesRelatedToEmail} />
    123
  </>;
}
