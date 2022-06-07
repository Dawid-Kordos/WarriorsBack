import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';

export const hallOfFameRouter = Router();

hallOfFameRouter

  .get('/', async (req, res) => {
    const warriors = (
      await WarriorRecord.topList(3)
    ).map((warrior, i) => ({
      place: i + 1,
      ...warrior,
    }));

    res.json(warriors);
  });
