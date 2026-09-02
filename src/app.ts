import express from 'express';

import { API_PREFIX } from './constants/application.constants.ts';
import { errorHandler } from './middleware/error.middleware.ts';
import { notFoundHandler } from './middleware/not-found.middleware.ts';
import routes from './routes/index.ts';

const app = express();

app.use(express.json());

app.use(API_PREFIX, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
