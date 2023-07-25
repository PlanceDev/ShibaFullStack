import dotenv from 'dotenv';
dotenv.config();
import './db';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import ExpressRateLimit from 'express-rate-limit';

const originList: any = [
  process.env.PRODUCTION_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const app = express();
const server = http.createServer(app);

const rateLimiter = ExpressRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
});

app.use(
  cors({
    origin: originList,
    credentials: true,
  })
);

// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use(bodyParser.json({ limit: '10mb' })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use(ExpressMongoSanitize()); // Data sanitization against NoSQL query injection
app.use(cookieParser());
app.use(express.json());

// Routes
import userRoute from './routes/user';
import referralRoute from './routes/referral';
import contributeRoute from './routes/contribute';
import imageRoute from './routes/image';

// Route Middlewares
app.use('/api/user', rateLimiter, userRoute);
app.use('/api/referral', rateLimiter, referralRoute);
app.use('/api/contribute', rateLimiter, contributeRoute);
app.use('/api/image', rateLimiter, imageRoute);

// Redirect http to https and remove www from url
if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    // redirect http to https
    if (req.header('x-forwarded-proto') !== 'https')
      return res.redirect(`https://${req.header('host')}${req.url}`);

    // replace www with non-www
    if (req.header('host')?.startsWith('www.')) {
      return res.redirect(
        301,
        `https://${req.header('host')?.replace('www.', '')}${req.url}`
      );
    }

    next();
  });
}

// Point the server to the build folder of the app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../../client', 'build', 'index.html')
    );
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
