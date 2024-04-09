"use client";

// outsource dependencies
import { useState, useEffect, useCallback } from "react";

// local dependencies
import { ENV } from "@/app/constants/env";
import Loader from "@/app/[lang]/components/Loader";
import PostList from "@/app/[lang]/views/post-list";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import PageHeader from "@/app/[lang]/components/PageHeader";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

export default function Blog () {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | undefined>();

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/articles`;
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: {
            populate: "*",
          },
        },
        pagination: {
          start: start,
          limit: limit,
        },
        filters: {
          authorsBio: {
            name: {
              $eq: selectedAuthorName
            }
          }
        }
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(path, urlParamsObject, options);

      setData(start === 0 ? responseData.data : (prevData: any[]) => [...prevData, ...responseData.data]);

      setMeta(responseData.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedAuthorName]);

  function loadMorePosts (): void {
    const nextPosts = meta!.pagination.start + meta!.pagination.limit;
    fetchData(nextPosts, ENV.NEXT_PUBLIC_PAGE_LIMIT);
  }

  useEffect(() => {
    fetchData(0, ENV.NEXT_PUBLIC_PAGE_LIMIT);
  }, [fetchData]);

  if (isLoading) return <Loader/>;

  return (
    <div>
      <PageHeader heading="Our Blog" text="Checkout Something Cool"/>
      <PostList data={data} onChangeAuthorNameFilter={setSelectedAuthorName}>
        {meta!.pagination.start + meta!.pagination.limit <
          meta!.pagination.total && (
            <div className="flex justify-center">
              <button
                type="button"
                className="px-6 py-3 text-sm rounded-lg hover:underline dark:bg-gray-900 dark:text-gray-400"
                onClick={loadMorePosts}
              >
                Load more posts...
              </button>
            </div>
          )}
      </PostList>
    </div>
  );
}
