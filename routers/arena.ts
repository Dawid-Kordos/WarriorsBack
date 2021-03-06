import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';
import { ValidationError } from '../utils/errors';
import { fight } from '../utils/fight';

export const arenaRouter = Router();

arenaRouter

  .get('/fight-form', async (req, res) => {
    const warriors = await WarriorRecord.getAll();
    res.json(warriors);
  })

  .post('/fight', async (req, res) => {
    const { warrior1: warrior1Id, warrior2: warrior2Id } = req.body;

    if (warrior1Id === warrior2Id) {
      throw new ValidationError('There must be two different warriors!');
    }

    const warrior1 = await WarriorRecord.getOne(warrior1Id);
    const warrior2 = await WarriorRecord.getOne(warrior2Id);

    if (!warrior1) {
      throw new ValidationError('Warrior 1 is not selected or does not exist.');
    }

    if (!warrior2) {
      throw new ValidationError('Warrior 2 is not selected or does not exist.');
    }

    const { log, winner } = fight(warrior1, warrior2);

    winner.wins++;

    await winner.update();

    res.json(log);
  });
