// local dependencies
import { Article } from "@/app/types/article";
import { Authors } from "@/app/[lang]/private/dashboard/authors";

export function Articles ({ articles }: { articles: Array<Article> }) {
  return articles.map(({ id, attributes }: Article) => {
    const authors = attributes.authors?.data;
    return <div key={id} className="flex flex-col sm:flex-row sm:items-stretch sm:space-x-4 mb-1">
      <div className="w-full border rounded-lg rounded-r-none border-r-0 pl-1 pt-1">{attributes.title}</div>
      {authors && <Authors authors={authors} />}
    </div>;
  });
}
