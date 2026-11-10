import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { fileURLToPath } from 'url'
import { payloadAuthOptions } from './lib/auth'
import { betterAuthPlugin } from 'payload-auth/better-auth'
import { editor } from './editor/editor'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'
import { Notifications } from './collections/Notifications'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { payloadTheme } from 'payload-theme'
import { seoPlugin } from '@payloadcms/plugin-seo';
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { janitor } from '@seshuk/payload-plugin-janitor'
// import { payloadAiPlugin } from '@ai-stack/payloadcms'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Media, Tags,Posts,Comments,Notifications,Categories,Orders,Products],
  editor,
  secret: process.env.PAYLOAD_SECRET || 'یک-رشته-تصادفی-قوی',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  email: process.env.EMAIL_USER && process.env.EMAIL_PASS
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_USER,
      defaultFromName: 'Atlas Door',
      transportOptions: {
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    })
  : undefined,
  plugins: [
    betterAuthPlugin(payloadAuthOptions),
    uploadthingStorage({
      collections: {
        media: true, // 
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN || '',
        acl: 'public-read',
      },
    }),
    payloadTheme({ accent: '#0d9488' }),
    seoPlugin({
      collections: [
        'posts', 'products'
      ],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title}`,
      generateDescription: ({ doc }) => doc.desc, 
      tabbedUI: true, 
    }),
    importExportPlugin({
      collections: [{ slug: 'users' }, { slug: 'posts' },{ slug: 'products' },{slug:'orders'}],
    }),
    
    // payloadAiPlugin({
    //   collections: {
    //     [Posts.slug]: true,
    //   },
    //   debugging: false,
    // }),
janitor({
      collections: { media: true ,tags: true ,posts: true ,products: true ,categories: true },
    }),
  ],
})