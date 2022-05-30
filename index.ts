import express, {json} from 'express';
import 'express-async-errors';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(json());

//routes

app.listen(3001, '0.0.0.0',() => console.log('Server is running on port 3000'));
