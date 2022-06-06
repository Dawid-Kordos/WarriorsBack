import express, {json} from 'express';
import 'express-async-errors';
import cors from 'cors';
import {handleError} from "./utils/errors";
import {warriorRouter} from "./routers/warrior";
import {arenaRouter} from "./routers/arena";
import {hallOfFameRouter} from "./routers/hall-of-fame";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(json());

app.use('/warrior', warriorRouter);
app.use('/arena', arenaRouter);
app.use('/hall-of-fame', hallOfFameRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => console.log('Server is running on port 3001...'));
