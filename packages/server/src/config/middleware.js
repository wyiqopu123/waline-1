const cors = require('@koa/cors');
const routerREST = require('think-router-rest');
const isDev = think.env === 'development';
const isTcb = think.env === 'cloudbase';
const isDeta = think.env === 'deta' || process.env.DETA_RUNTIME === 'true';

module.exports = [
  {
    handle: 'dashboard',
    match: /^\/ui/,
  },

  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
      requestTimeoutCallback: isTcb || isDeta ? false : () => {},
    },
  },

  {
    handle: 'version',
  },

  { handle: cors },

  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: true,
      contentType: () => 'json',
      error(err, ctx) {
        if (/favicon.ico$/.test(ctx.url)) {
          return;
        }
        if (think.isPrevent(err)) {
          return false;
        }

        console.error(err);
      },
    },
  },

  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb',
    },
  },

  {
    handle: 'router',
    options: {},
  },

  { handle: routerREST },

  'logic',
  'controller',
];
