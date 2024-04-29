// local dependencies
import { Article } from '@/app/types/article';
import { Debug } from '@/app/[lang]/components/Debug';
import { Articles } from '@/app/[lang]/private/dashboard/articles';
import { serverFetchApi } from '@/services/request/server-fetch-api';
import PossibleRequests from '@/app/[lang]/private/dashboard/possible-requests';

type ArticlesType = {
  data: Array<Article>
}

export default async function Page () {
  const articles: ArticlesType = await serverFetchApi('/articles', {
    params: {
      populate: {
        authors: {
          populate: {
            avatar: {
              fields: ['url', 'alternativeText', 'width', 'height']
            }
          }
        },
      }
    }
  });

  return <section className="container p-6 mx-auto">
    <Debug articles={articles} />
    <Articles articles={articles.data} />
    <PossibleRequests />
  </section>;
}
