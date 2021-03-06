const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    bizcharts: 'BizCharts',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  proxy: {
    '/api/admin': {
      target: 'http://47.104.141.35:8080/', 
      changeOrigin: true,
    },
    '/api/framework': {
      target: 'http://47.104.141.35:8080/',
      changeOrigin: true,
    },
    '/api/ljdp': {
      target: 'http://47.104.141.35:8080/',
      changeOrigin: true,
    },
    '/api/ogp/*': {
      target: 'http://47.106.185.185:8080',
      changeOrigin: true,
    }
  },
};
