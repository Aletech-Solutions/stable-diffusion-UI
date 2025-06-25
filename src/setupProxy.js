const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sdapi',
    createProxyMiddleware({
      target: 'http://192.168.3.70:7861',
      changeOrigin: true,
      secure: false,
      timeout: 180000, // 3 minutos
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Erro no proxy');
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
      }
    })
  );
}; 