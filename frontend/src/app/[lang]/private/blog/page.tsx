"use client";

// outsource dependencies
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

// local dependencies
import { ENV } from "@/app/constants/env";
import { PRIVATE_BLOG_EDIT } from "@/services/link";
import Loader from "@/app/[lang]/components/Loader";
import PostList from "@/app/[lang]/views/post-list";
import PageHeader from "@/app/[lang]/components/PageHeader";
import { clientFetchAPI } from "@/app/[lang]/utils/client-fetch-api";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

export default function Blog () {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<Array<any>>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | undefined>();

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    try {
      const params = {
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
      const responseData = await clientFetchAPI('/articles', { params });
      setData(start === 0 ? responseData.data.data : (prevData: Array<any>) => [...prevData, ...responseData.data.data]);

      setMeta(responseData.data.meta);
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

  if (isLoading && data.length === 0) return <Loader />;

  return <div>
    <PageHeader heading="Our Blog" text="Checkout Something Cool" />
    <section className="container flex justify-end px-6 mx-auto">
      <div className="flex justify-center md:justify-end w-full">
        <div className="md:w-[50%] lg:w-[32%] flex justify-center">
          <div className="max-w-sm lg:w-[300px] xl:min-w-[375px] w-full flex justify-end">
            <Link
              href={PRIVATE_BLOG_EDIT()}
              className="flex justify-center leading-[11px] bg-[black] text-[white] text-lg p-4 rounded-lg relative after:content-['+'] after:absolute after:top-[-3px] after:translate-y-[12px]"
            />
          </div>
        </div>
      </div>
    </section>
    <PostList data={data} onChangeAuthorNameFilter={setSelectedAuthorName}>
      {meta!.pagination.start + meta!.pagination.limit < meta!.pagination.total && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMorePosts}
            className="px-6 py-3 text-sm rounded-lg hover:underline dark:bg-gray-900 dark:text-gray-400"
          >
            Load more posts...
          </button>
        </div>
      )}
    </PostList>
  </div>;
}
