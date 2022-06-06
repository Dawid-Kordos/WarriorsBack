import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";
import {ValidationError} from "../utils/errors";

type WarriorRecordResult = [WarriorRecord[], FieldPacket[]];

export class WarriorRecord {
    public id?: string;
    public readonly name: string;
    public readonly power: number;
    public readonly defence: number;
    public readonly resistance: number;
    public readonly agility: number;
    public wins?: number;

    constructor(obj: Omit<WarriorRecord, 'insert' | 'update' | 'delete'>) {
        const {id, name, power, defence, resistance, agility, wins} = obj;

        const stats = [power, defence, resistance, agility];

        const sum = stats.reduce((prev, curr) => prev + curr, 0)

        for (const stat of stats) {
            if (stat < 1) {
                throw new ValidationError('Each property must have min 1 point.');
            }
        }

        if (sum !== 10) {
            throw new ValidationError(`Sum of all properties (power, defence, resistance and agility) must be equal 10, but you have entered ${sum}.`);
        }

        if (name.trim().length < 3 || name.length > 50) {
            throw new ValidationError(`Name should have at least 3 and at most 50 characters, but you entered ${name.trim().length}.`);
        }

        this.id = id ?? uuid();
        this.name = name;
        this.power = power;
        this.defence = defence;
        this.resistance = resistance;
        this.agility = agility;
        this.wins = wins ?? 0;
    }

    async insert(): Promise<string> {
        await pool.execute(
            'INSERT INTO `warriors` (`id`, `name`, `power`, `defence`, `resistance`, `agility`, `wins`) VALUES(:id, :name, :power, :defence, :resistance, :agility, :wins)', {
                id: this.id,
                name: this.name,
                power: this.power,
                defence: this.defence,
                resistance: this.resistance,
                agility: this.agility,
                wins: this.wins,
            });

        return this.id;
    }

    async update(): Promise<void> {
        await pool.execute('UPDATE `warriors` SET `wins` = :wins WHERE `id` = :id', {
            wins: this.wins,
            id: this.id,
        });
    }

    async delete(): Promise<void> {
        await pool.execute('DELETE FROM `warriors` WHERE `id` = :id', {
            id: this.id,
        })
    }

    static async getOne(id: string): Promise<WarriorRecord | null> {
        const [result] = await pool.execute('SELECT * FROM `warriors` WHERE `id` = :id', {
            id,
        }) as WarriorRecordResult;

        return result.length === 0 ? null : new WarriorRecord(result[0]);
    }

    static async getAll(): Promise<WarriorRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `warriors`') as WarriorRecordResult;

        return results.map(obj => new WarriorRecord(obj));
    }

    static async topList(topCount: number): Promise<WarriorRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `warriors` ORDER BY `wins` DESC LIMIT :topCount', {
            topCount,
        }) as WarriorRecordResult;

        return results.map(obj => new WarriorRecord(obj));
    }

    static async isNameUsed(name: string): Promise<boolean> {
        const [result] = await pool.execute('SELECT * FROM `warriors` WHERE `name` = :name', {
            name,
        }) as WarriorRecordResult;

        return result.length > 0;
    }

}
