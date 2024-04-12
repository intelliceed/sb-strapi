// outsource dependencies
import cn from "classnames";
import Image from 'next/image';

// local dependencies
import { Author } from "@/app/types/author";
import { Article } from "@/app/types/article";
import { Debug } from "@/app/[lang]/components/Debug";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

type Articles = {
  data: Array<Article>
}

export default async function Page () {
  const articles: Articles = await fetchAPI('/articles', {
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

  // const article = await fetchAPI('/articles/8', {
  //   populate: {
  //     authors: {
  //       populate: true
  //     }
  //   }
  // });
  // console.log(article);

  const articlesData = articles.data;

  return <section className="container p-6 mx-auto">
    <Debug articles={articles} />


    {articlesData.map(({ id, attributes }: Article) => {
      const authors = attributes.authors?.data;
      return <div key={id} className="flex flex-col sm:flex-row sm:items-stretch sm:space-x-4 mb-1">
        <div className="w-full border rounded-lg rounded-r-none border-r-0 pl-1 pt-1">{attributes.title}</div>
        {authors && <Authors authors={authors} />}
      </div>;
    })}

  </section>;
}

type AuthorsProps = {
  authors?: Array<Author>,
  className?: string,
  wrapperClassName?: string,
}

function Authors ({ authors, className = '', wrapperClassName = '' }: AuthorsProps) {
  return <div className={cn("flex space-x-1 w-full", wrapperClassName)}>
    {authors?.map(({ id, attributes }) => {
      const { url, alternativeText } = attributes.avatar.data.attributes;
      const avatarUrl = getStrapiMedia(url);
      return <div key={id} className={className}>
        {avatarUrl &&
          <Image title={attributes.name} src={avatarUrl} alt={alternativeText} width={60} height={60} className="rounded-full aspect-square object-cover" />}
      </div>;
    })}
  </div>;
}
