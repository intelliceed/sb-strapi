type privateBlogArticle = {
  category: string,
  slug: string,
}

export const PRIVATE_BLOG_ARTICLE = ({ category, slug }: privateBlogArticle) => {
  return `/private/blog/${category}/${slug}`;
};

export const PRIVATE_BLOG_EDIT = () => {
  return '/private/blog/edit';
};
