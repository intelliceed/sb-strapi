import { Author } from "@/app/types/author";

export type Article = {
  id: number,
  attributes: {
    slug: string,
    title: string,
    description: string,
    authors?: { data: Array<Author> }
  }
}
