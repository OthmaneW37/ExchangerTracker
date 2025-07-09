const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy pour albarakaxchange.com
  app.use(
    '/albarakaxchange',
    createProxyMiddleware({
      target: 'https://www.albarakaxchange.com',
      changeOrigin: true,
      pathRewrite: {
        '^/albarakaxchange': ''
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
      }
    })
  );
};