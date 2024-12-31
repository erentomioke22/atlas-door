import { prisma } from '@utils/database';

export default async function sitemap(){
    const posts = await prisma.post.findMany({
        where: {},
      });

      const postEntries = posts.map(({link,updatedAt,images,contentImages})=>(
        {
            url:`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
            lastModified: `${new Date(updatedAt)}`,
            changeFrequency: 'yearly',
            priority: 1,
            images:[
            `${process.env.NEXT_PUBLIC_BASE_URL}/${images[0]}`,
            ...contentImages.map(contentImage=>`${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`)
            ],
            // alternates: {
            //     languages: {
            //       fa: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
            //     },
            //   },
            
        }
      ))

      const routes = ['automatic-door','balcony-glass','partition-glass','roller-shutter','tempered-glass','posts']
      const routeEntries = routes.map((route)=>(
        {
            url:`${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
            lastModified: `${new Date()}`,
            changeFrequency: 'yearly',
            priority: 1,
            // images:[
            // `${process.env.NEXT_PUBLIC_BASE_URL}/${images[0]}`,
            // ...contentImages.map(contentImage=>`${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`)
            // ],
            // alternates: {
            //     languages: {
            //       fa: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
            //     },
            //   },
            
        }
      ))
    return[
      {
        url:`${process.env.NEXT_PUBLIC_BASE_URL}`,
        lastModified: `${new Date()}`,
        changeFrequency: 'yearly',
        priority: 1,
        // images:[
        // `${process.env.NEXT_PUBLIC_BASE_URL}/${images[0]}`,
        // ...contentImages.map(contentImage=>`${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`)
        // ],
        // alternates: {
        //     languages: {
        //       fa: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
        //     },
        //   },
        
    },
        ...routeEntries,
        ...postEntries
    ]
}


