require('dotenv').config();
import express from 'express';
import admin from 'firebase-admin';
import mongoose from 'mongoose';
import cors from 'cors';
import api from './src/api';
import onSockets from './src/sockets';
import authIo from './src/sockets/auth';
import rateLimit from 'express-rate-limit';
import apicache from 'apicache';

require('stripe')(process.env.STRIPE_TEST_API_KEY);

const app = express();
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
    limit: '50mb',
  }),
);
app.use(cors());

import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
import path from 'path';
const io = new Server(server);

app.set('socketio', io);

///choose credentials based on the environment of the server

if (process.env.MONGODB_CREDENTIAL) {
  mongoose.connect(process.env.MONGODB_CREDENTIAL);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('successfully connected to softlete database');
  });
} else {
  console.error('env mongo empty');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', apiLimiter);
app.use('/api', api);

// dev only
app.get('/clear-cache', (req, res) => {
  apicache.clear([]);
  return res.send('cleared');
});

const root = path.resolve(__dirname, 'client', 'build');
app.use(express.static(root));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

io.use(authIo);
io.on('connection', onSockets);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
