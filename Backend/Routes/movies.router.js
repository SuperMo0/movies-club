import { Router } from "express";
import * as controller from '../controllers/movies.controller.js'
import { getSecondsUntil3AM } from '../utils/cache.js';

const router = Router();

router.use((req, res, next) => {
    res.set('Cache-Control', `public, max-age=${getSecondsUntil3AM()}`);
    next();
});

router.get('/', controller.getAllMovies);

router.get('/today', controller.getTodayMovies);


export default router


