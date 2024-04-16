// local dependencies
import { Article } from "@/app/types/article";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { Articles } from "@/app/[lang]/private/dashboard/articles";

type ArticlesType = {
  data: Array<Article>
}

export default async function Page () {
  const articles: ArticlesType = await fetchAPI('/articles', {
    populate: {
      authors: {
        populate: {
          avatar: {
            fields: ['url', 'alternativeText', 'width', 'height']
          }
        }
      },
    }
  });

  return <section className="container p-6 mx-auto">
    <Articles articles={articles.data} />
  </section>;
}
