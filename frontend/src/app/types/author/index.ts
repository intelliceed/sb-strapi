import { Article } from "@/app/types/article";
import { Media } from "@/app/types/components/media";

export type Author = {
  id: number,
  attributes: {
    name: string,
    email: string,
    avatar: {
      data: {
        id: number,
        attributes: Media
      }
    }
    articles?: { data: Array<Article> },
  }
}
