'use client';

// outsource dependencies
import { FormEvent } from "react";
import { clientFetchAPI } from "@/app/[lang]/utils/client-fetch-api";

enum Article {
  title = 'title',
  description = 'description',
}

export function EditForm () {

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const result = await clientFetchAPI('/articles', {
      method: 'POST',
      body: {
        data: {
          title: formData.get(Article.title),
          description: formData.get(Article.description),
        }
      }
    });
    console.log(result);
  };

  return <form onSubmit={handleSubmit}>
    <div className="flex flex-col w-[300px] space-y-2">
      <input type="text" name={Article.title} className="border rounded-lg p-1" />
      <input type="text" name={Article.description} className="border rounded-lg p-1" />
      <button className="bg-black text-white rounded-lg p-1">Submit</button>
    </div>
  </form>;
}
