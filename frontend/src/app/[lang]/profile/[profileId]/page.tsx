// outsource dependencies
import Image from 'next/image';

// local dependencies
import { Debug } from "@/app/[lang]/components/Debug";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

type User = {
  data: {
    id: number,
    attributes: {
      name: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      avatar: Avatar,
      articles: {
        data: Array<ArticleData>
      }
    }
  },
  meta: {}
}

type Avatar = {
  data: {
    id: number,
    attributes: {
      url: string,
      alternativeText?: string,
      caption?: string,
      width: number,
      height: number,
    }
  }
};

type ArticleData = { id: number, attributes: ArticleAttributes }

type ArticleAttributes = { slug: string, title: string, description: string }

type PageProps = {
  params: {
    profileId: string
  }
}

export default async function ({ params }: PageProps) {
  const user: User = await fetchAPI(`/authors/${params.profileId}`, {
    populate: {
      avatar: {
        fields: ['url', 'alternativeText', 'width', 'height']
      },
      articles: {
        fields: ['slug', 'title', 'description']
      }
    }
  });

  const { name, email, createdAt, articles } = user.data.attributes;

  const { url, alternativeText, width, height } = user.data.attributes.avatar.data.attributes;
  const avatar = getStrapiMedia(url);

  return <section className="p-6 mx-auto container">
    <div className="flex space-x-4 mb-5">
      <div className="w-full">
        <Debug user={user}></Debug>
        <Image width={width} height={height} src={avatar as string} alt={alternativeText as string} className="rounded-xl" />
      </div>
      <div className="w-full">
        <ProfileRow name="Name:" value={name} />
        <ProfileRow name="Email:" value={email} />
        <ProfileRow name="Created profile:" value={new Date(createdAt).toLocaleString().split(',')[0]} />
      </div>
    </div>
    <Articles articles={articles.data} />
  </section>;
}

function ProfileRow ({ name, value }: { name: string, value: string }) {
  return <p className="space-x-1">
    <span className="text-gray-500 text-sm">{name}</span>
    <span className="text-gray-900">{value}</span>
  </p>;
}

type ArticlesProps = {
  articles: Array<ArticleData>
}

function Articles ({ articles }: ArticlesProps) {
  return <div className="space-y-2">
    <h2 className="text-xl">Articles:</h2>
    <Debug articles={articles} />
    {articles.map(({ id, attributes }) => <Article key={id} attributes={attributes} />)}
  </div>;
}

function Article ({ attributes }: { attributes: ArticleAttributes }) {
  const articleAttributes = Object.entries(attributes);
  return <div className="p-3 border rounded-xl">
    {articleAttributes.map(([key, value]) => <div key={key} className="space-x-1">
      <span className="text-gray-500 text-sm">{key}:</span>
      <span className="text-gray-900">{value}</span>
    </div>)}
  </div>;
}
