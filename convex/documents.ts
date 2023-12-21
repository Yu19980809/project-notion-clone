import { v } from 'convex/values'

import {mutation, query} from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

const checkIdentity = (identity: any) => {
  if (!identity) {
    throw new Error('Not authenticated')
  }

  return identity.subject
}

const checkExist = async (existingDocument: any, userId: string) => {
  if (!existingDocument) {
    throw new Error('Not found')
  }

  if (existingDocument.userId !== userId) {
    throw new Error('Unauthorized')
  }
}

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    return document
  }
})

export const archive = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)
    const existingDocument = await ctx.db.get(args.id)
    checkExist(existingDocument, userId)

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true
        })

        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true
    })

    // archive all children documents under current document
    recursiveArchive(args.id)

    return document
  }
})

export const getSidebar = query({
  args: {
    parenDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', q =>
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parenDocument)
      )
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  }
})

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  }
})

export const restore = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)
    const existingDocument = await ctx.db.get(args.id)
    checkExist(existingDocument, userId)

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        )
        .collect()

        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: false
          })

          await recursiveRestore(child._id)
        }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false
    }

    if (existingDocument!.parentDocument) {
      const parent = await ctx.db.get(existingDocument!.parentDocument)

      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    // restore all children documents under current documents
    recursiveRestore(args.id)

    return document
  }
})

export const remove = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)
    const existingDocument = await ctx.db.get(args.id)
    checkExist(existingDocument, userId)

    const document = await ctx.db.delete(args.id)

    return document
  }
})

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  }
})

export const getById = query({
  args: {
    documentId: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    console.log('identity', identity)
    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Not found')
    }

    if (document.isPublished && !document.isArchived) {
      return document
    }

    // Unpublished documents can only be viewed by owner
    if (!identity) {
      console.log('Not Authenticated')
      throw new Error('Not Authenticated')
    }

    const userId = identity.subject

    if (document.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return document
  }
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)

    const {id, ...rest} = args
    const existingDocument = await ctx.db.get(id)
    checkExist(existingDocument, userId)

    const document = await ctx.db.patch(id, { ...rest })

    return document
  }
})

export const removeIcon = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)
    const existingDocument = await ctx.db.get(args.id)
    checkExist(existingDocument, userId)

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    })

    return document
  }
})

export const removeCoverImage = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = checkIdentity(identity)
    const existingDocument = await ctx.db.get(args.id)
    checkExist(existingDocument, userId)

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined
    })

    return document
  }
})
