/** General Configurations Like PORT, HOST names and etc... */

const config = {
  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      link: [
        {
          href: 'https://fonts.googleapis.com/css?family=Roboto',
          rel: 'stylesheet',
          type: 'text/css'
        }
      ],
      meta: [
        {charset: 'utf-8'},
        {'http-equiv': 'x-ua-compatible', content: 'ie=edge'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {name: 'description', content: '이미지 번역 솔루션 오후스튜디오 입니다'},
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=UA-217210357-1',
          type: 'text/javascript'
        },
        {
          async: true,
          src: 'https://wcs.naver.net/wcslog.js',
          type: 'text/javascript'
        }
      ],
      title: '오후 스튜디오'
    }
  },
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  ssr: true,
  sentry: {
    dsn: '', // your sentry dsn here
    options: {}
  }
};

module.exports = config;
