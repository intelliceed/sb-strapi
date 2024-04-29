// outsource dependencies
import type { Metadata } from 'next';

// local dependencies
import Post from '@/app/[lang]/views/post';
import { serverFetchApi } from '@/services/request/server-fetch-api';

async function getPostBySlug (slug: string) {
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      cover: { fields: ['url'] },
      authorsBio: { populate: '*' },
      category: { fields: ['name'] },
      blocks: {
        populate: {
          '__component': '*',
          'files': '*',
          'file': '*',
          'url': '*',
          'body': '*',
          'title': '*',
          'author': '*',
        }
      },
    },
  };
  return await serverFetchApi(path, {
    params: urlParamsObject
  });
}

async function getMetaData (slug: string) {
  const response = await serverFetchApi('/articles', {
    params: {
      filters: { slug },
      populate: { seo: { populate: '*' } },
    }
  });
  return response.data;
}

export async function generateMetadata ({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = await getMetaData(params.slug);
  const metadata = meta[0].attributes.seo;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

export default async function PostRoute ({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getPostBySlug(slug);
  if (data.data.length === 0) return <h2>no post found</h2>;
  return <Post data={data.data[0]} />;
}
