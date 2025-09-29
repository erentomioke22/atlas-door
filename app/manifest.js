export default function manifest() {
    return {
      name: 'atlas door',
      short_name: 'اطلس در',
      description: 'نمایندگی شیشه سکوریت - فروش و انجام خدمات درب اتوماتیک درو پنجره ی و کرکره برقی',
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: '#fff',
      icons: [
        {
          src: './favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }