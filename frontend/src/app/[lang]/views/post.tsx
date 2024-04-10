// outsource dependencies
import Link from 'next/link';
import Image from 'next/image';

// local dependencies
import { postRenderer } from '@/app/[lang]/utils/post-renderer';
import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';

interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    authorsBio: {
      data: {
        id: number,
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
    blocks: any[];
    publishedAt: string;
  };
}

export default function Post ({ data }: { data: Article }) {
  const { title, description, publishedAt, cover, authorsBio } = data.attributes;
  const author = authorsBio.data?.attributes;
  const authorName = author?.name;

  const authorId = authorsBio.data.id
  const imageUrl = getStrapiMedia(cover.data?.attributes.url || null);
  const authorImgUrl = getStrapiMedia(authorsBio.data?.attributes.avatar.data.attributes.url || null);

  return <article className="space-y-8 dark:bg-black dark:text-gray-50">
    {imageUrl && <Image
      width={400}
      height={400}
      src={imageUrl}
      alt="article cover image"
      className="w-full h-96 object-cover rounded-lg"
    />}
    <div className="space-y-6">
      <h1 className="leading-tight text-5xl font-bold ">{title}</h1>
      <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
        <div className="flex items-center md:space-x-2">
          {authorImgUrl && <Link href={`/profile/${authorId}`}>
            <Image
              width={400}
              height={400}
              src={authorImgUrl}
              alt="article cover image"
              className="w-14 h-14 border rounded-full dark:bg-gray-500 dark:border-gray-700 object-cover"
            />
          </Link>}
          <p className="text-md dark:text-violet-400">
            {authorName} • {formatDate(publishedAt)}
          </p>
        </div>
      </div>
    </div>

    <div className="dark:text-gray-100">
      <p>{description}</p>

      {data.attributes.blocks.map((section: any, index: number) => postRenderer(section, index))}
    </div>
  </article>;
}
