// outsource dependencies
import Link from "next/link";
import Image from "next/image";

// local dependencies
import { getStrapiMedia, formatDate } from "../utils/api-helpers";

// config
interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    authorsBio: {
      data: {
        attributes: {
          name: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
  };
}

export default function PostList ({
  data: articles,
  onChangeAuthorNameFilter,
  children,
}: {
  data: Article[];
  children?: React.ReactNode;
  [key: string]: any
}) {

  const handleChangeAuthorNameFilter = (name: string | undefined) => onChangeAuthorNameFilter((prev: string | undefined) => prev === name ? undefined : name);

  return <section className="container p-6 mx-auto space-y-6 sm:space-y-12">
    <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => {
        const imageUrl = getStrapiMedia(article.attributes.cover.data?.attributes.url || null);

        const category = article.attributes.category.data?.attributes;
        const authorsBio = article.attributes.authorsBio.data?.attributes;

        const avatarUrl = getStrapiMedia(authorsBio?.avatar.data.attributes.url || null);

        return <div className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900 lg:w-[300px] xl:min-w-[375px] rounded-2xl overflow-hidden shadow-lg">
          {imageUrl && <Image
            width="240"
            height="240"
            src={imageUrl}
            alt="presentation"
            className="object-cover w-full h-44"
          />}

          <div className="p-6 space-y-2 relative">
            {avatarUrl && <button onClick={() => handleChangeAuthorNameFilter(authorsBio?.name)} className="absolute -top-8 right-4">
              <Image
                alt="avatar"
                width="80"
                height="80"
                src={avatarUrl}
                className="rounded-full h-16 w-16 object-cover"
              />
            </button>}

            <Link
              key={article.id}
              href={`/private/blog/${category?.slug}/${article.attributes.slug}`}
            >
              <h3 className="text-2xl font-semibold hover:underline focus:underline">{article.attributes.title}</h3>
            </Link>

            <div className="flex justify-between items-center">
              <span className="text-xs dark:text-gray-400">{formatDate(article.attributes.publishedAt)}</span>
              {authorsBio && <button className="flex" onClick={() => handleChangeAuthorNameFilter(authorsBio?.name)}>
                <span className="text-xs dark:text-gray-400">{authorsBio.name}</span>
              </button>}
            </div>
            <p className="py-4">{article.attributes.description}</p>
          </div>
        </div>;
      })}
    </div>
    {children && children}
  </section>;
}
