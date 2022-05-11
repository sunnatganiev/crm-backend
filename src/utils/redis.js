/* eslint-disable no-new */
const client = require('redis').createClient(process.env.REDIS_URL);

//redis://localhost:6379

exports.setJWT = async (key, value) => {
  await client.connect();
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

exports.getJWT = async (key) => await client.get(key);

exports.deleteJWT = async (key) => {
  await client.del(key);
  console.log('token deleted');
};
