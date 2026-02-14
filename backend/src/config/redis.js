const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
       socket: {
        host: 'redis-13936.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13936
    }
});

module.exports = redisClient