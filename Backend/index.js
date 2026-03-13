import 'dotenv/config'
import express from 'express'
import authRouter from './Routes/auth.router.js'
import socialRouter from './Routes/social.router.js'
import moviesRouter from './Routes/movies.router.js'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { start } from './utils/fetchMovies.js'
import cron from 'node-cron';
import path from 'path'
import debug from 'debug'

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // to do: Implement redis store to have consistency in case of multiple server instances
})

const corsOptions = cors({
    origin: 'http://localhost:5173',
    credentials: true,
})

const app = express();

app.use(corsOptions)

app.use(cookieParser());

app.use(express.json());

app.use(limiter)

app.use('/api/social', socialRouter);

app.use('/api/auth', authRouter);

app.use('/api/movies', moviesRouter);


app.use((err, req, res, next) => {
    return res.status(500).json({ message: err });
})

const PORT = process.env.PORT || 3000;



if (process.env.NODE_ENV != 'development') {
    const staticPath = path.join(process.cwd(), '..', 'Frontend/dist');

    app.use(express.static(path.join(staticPath)));

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(staticPath, '/index.html'));
    })
}

let cron_debug = debug("cron");

app.listen(PORT, async () => {
    console.log('server running on port: ', PORT);

    if (process.env.NODE_ENV != 'development') await start();

    cron.schedule('0 3 * * *', async () => {
        cron_debug("Running daily updates")
        await start();
    });
});