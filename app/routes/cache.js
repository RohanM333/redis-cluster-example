const express = require('express');
const router = express.Router();

router.post('/cache', async (req, res) => {
  const { key, value, ttl } = req.body;
  try {
    if (ttl) {
      await req.redis.set(key, value, 'EX', ttl); // Set key with expiration
    } else {
      await req.redis.set(key, value);
    }
    res.status(200).send('Key set successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/cache/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const value = await req.redis.get(key);
    res.status(200).json({ key, value });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/publish', async (req, res) => {
  const { channel, message } = req.body;
  try {
    await req.redis.publish(channel, message);
    res.status(200).send('Message published successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/subscribe', (req, res) => {
  const { channel } = req.body;
  const subscriber = req.redis.duplicate(); // Create a new Redis connection for the subscriber

  subscriber.subscribe(channel, (err, count) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(`Subscribed to ${count} channel(s)`);
    }
  });

  subscriber.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
  });
});

module.exports = router;
