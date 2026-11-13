import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Enquiries } from './collections/Enquiries'
import { Faqs } from './collections/Faqs'
import { LegalPages } from './collections/LegalPages'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { PricingItems } from './collections/PricingItems'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Services,
    PricingItems,
    Faqs,
    Testimonials,
    Posts,
    LegalPages,
    Media,
    Enquiries,
    Users,
  ],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes go through committed migrations (`npm run migrate:create`, then
    // `npm run migrate`). Auto-push is only switched on for throwaway test databases.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  sharp,
  plugins: [
    // Media goes to Vercel Blob when a token is set (Vercel). Without one (local dev,
    // tests) uploads are written to ./media on disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Upload straight from the browser to avoid Vercel's function body-size limit
      clientUploads: true,
    }),
  ],
})
