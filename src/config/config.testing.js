module.exports = {
  cors: {
    origin: ['*'],
  },
  mongodb: {
    host: 'pomelo-db',
    port: 27017,
    database: 'pomelo',
    qs: '?ssl=true&sslverifycertificate=false',
  },
  jwt: {
    secret: '184C0AB03F3628280C73DFF2360F450AEC2F4273DF400FBDBB722036130509A4',
  },
};
