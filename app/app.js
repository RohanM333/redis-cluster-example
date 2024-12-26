const express = require('express');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

const redis = new Redis.Cluster([
  {
    port: 6379,
    host: 'redis-node1'
  },
  {
    port: 6380,
    host: 'redis-node2'
  },
  {
    port: 6381,
    host: 'redis-node3'
  },
  {
    port: 6382,
    host: 'redis-node4'
  },
  {
    port: 6383,
    host: 'redis-node5'
  },
  {
    port: 6384,
    host: 'redis-node6'
  }
]);

app.use((req, res, next) => {
  req.redis = redis;
  next();
});

app.use('/api', require('./routes/cache'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
