import { CreateArticle } from '@/core/article/types'
import { db } from './db'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'
import { CreateComment } from '@/core/comment/types'
import { ProfileOutput } from '@/core/profile/types'

export const createArticleInDB = async (data: CreateArticle) => {
  const id = uuidv4()
  const date = new Date().toISOString()
  const author = getUserProfileFromDB(data.authorId)
  const articleSlug = slugify(data.title, { lower: true })

  db.articlesBySlug[articleSlug] = id

  const registeredArticle = db.articles[id] = {
    id,
    slug: articleSlug,
    title: data.title,
    description: data.description,
    body: data.body,
    tagList: data.tagList ?? [],
    createdAt: date,
    updatedAt: date,
    favoritesCount: 0,
    authorId: data.authorId,
  }

  return {
    article: registeredArticle,
    author,
  }
}

export const addCommentToAnArticleInDB = async (data: CreateComment) => {
  const date = new Date().toISOString()
  const id = Date.now()
  const author = getUserProfileFromDB(data.authorId)
  const articleId = db.articlesBySlug[data.articleSlug]

  if (!articleId) {
    throw new Error('Article does not exist')
  }

  const comment = {
    id,
    createdAt: date,
    updatedAt: date,
    body: data.body,
    articleId,
    authorId: data.authorId,
  }

  db.comments[articleId] = (db.comments[articleId] ?? []).concat(comment)

  return {
    comment,
    author,
  }
}

function getUserProfileFromDB (userId: string): ProfileOutput {
  const user = db.users[userId]
  if (!user) {
    throw new Error('Author does not exist')
  }
  return {
    username: user.username,
    bio: user.bio ?? '',
    image: user.image ?? '',
    following: false,
  }
}
