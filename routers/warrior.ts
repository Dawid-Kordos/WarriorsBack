import {Router} from 'express';
import {WarriorRecord} from '../records/warrior.record';
import {ValidationError} from '../utils/errors';

export const warriorRouter = Router();

warriorRouter

    .get('/', async (req, res) => {
        const warriors = await WarriorRecord.getAll();
        res.json({
            warriors,
        });
    })

    .post('/', async (req, res) => {
        const {
            name, power, defence, resistance, agility,
        } = req.body;

        if (await WarriorRecord.isNameUsed(name)) {
            throw new ValidationError(`Name '${name}' is already in use. Please choose another one.`);
        }

        const warrior = new WarriorRecord({
            ...req.body,
            power: Number(power),
            defence: Number(defence),
            resistance: Number(resistance),
            agility: Number(agility),
        });

        const id = await warrior.insert();

        res.json({
            name: warrior.name,
            id,
        });
    })

    .delete('/:id', async (req, res) => {
        const {id} = req.params;

        const warrior = await WarriorRecord.getOne(id);

        await warrior.delete();

        res.json({
            message: 'Warrior has been deleted.'
        });
    });
