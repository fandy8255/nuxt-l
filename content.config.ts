import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    blog: defineCollection({
        source: 'articles/*.md',
        type: 'page',
        // Define custom schema for docs collection
        schema: z.object({
          tags: z.array(z.string()),
          image: z.string(),
          date: z.date()
        })
      })
  }
})