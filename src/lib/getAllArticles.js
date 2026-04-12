import { articleModules } from './articles.generated'

export async function getAllArticles() {
  return articleModules
    .map(({ slug, module }) => ({
      slug,
      ...module.meta,
      component: module.default,
    }))
    .sort((a, z) => new Date(z.date) - new Date(a.date))
}
