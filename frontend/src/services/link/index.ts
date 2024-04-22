export const PRIVATE_BLOG = () => {
  return '/private/blog';
};

type privateBlogArticle = {
  category: string,
  slug: string,
}
export const PRIVATE_BLOG_ARTICLE = ({ category, slug }: privateBlogArticle) => {
  return `${PRIVATE_BLOG()}/${category}/${slug}`;
};

export const PRIVATE_BLOG_EDIT = () => {
  return `${PRIVATE_BLOG()}/edit`;
};
