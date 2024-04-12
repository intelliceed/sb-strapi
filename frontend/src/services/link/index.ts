type privateBlogArticle = {
  category: string,
  slug: string,
}

export const preparePrivateBlogArticleLink = ({ category, slug }: privateBlogArticle) => {
  return `/private/blog/${category}/${slug}`;
};
