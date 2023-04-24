import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3030;

async function bootstrap() {

  app.get('/', (req: Request, res: Response) => {
    res.send('Express Server');
  });

  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });

}

bootstrap();