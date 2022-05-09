const client = require('redis').createClient(process.env.REDIS_URL);

//redis://localhost:6379

exports.setJWT = async (key, value) => {
  await client.connect();
  // eslint-disable-next-line no-new
  new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) client.on('error', () => reject(err));
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.getJWT = async (key) =>
  new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
