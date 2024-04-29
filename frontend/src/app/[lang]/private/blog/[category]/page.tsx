// local dependencies
import PostList from '@/app/[lang]/views/post-list';
import PageHeader from '@/app/[lang]/components/PageHeader';
import { serverFetchApi } from '@/services/request/server-fetch-api';

async function fetchPostsByCategory (filter: string) {
  try {
    return await serverFetchApi('/articles', {
      params: {
        sort: { createdAt: 'desc' },
        filters: {
          category: {
            slug: filter,
          },
        },
        populate: {
          cover: { fields: ['url'] },
          category: {
            populate: '*',
          },
          authorsBio: {
            populate: '*',
          },
        },
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default async function CategoryRoute ({ params }: { params: { category: string } }) {
  const filter = params.category;
  const { data } = await fetchPostsByCategory(filter);

  //TODO: CREATE A COMPONENT FOR THIS
  if (data.length === 0) return <div>Not Posts In this category</div>;

  const { name, description } = data[0]?.attributes.category.data.attributes;

  return (
    <div>
      <PageHeader heading={name} text={description} />
      <PostList data={data} />
    </div>
  );
}

export async function generateStaticParams () {
  return [];
}
