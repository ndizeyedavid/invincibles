// src/models/Position.ts
import { RowDataPacket } from 'mysql2';
import { db, pool } from '../config/dbConnection';
import { BadRequestError } from '../errors/BadRequestError';

export interface IDistrict {
    district_id?: number;
    code: string;
    name: string;
}

export class District {
    static async findAll() {
        try {
            const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM district`);
            

            return result as IDistrict[];
        } catch (error) {
            console.error('Error fetching district:', error);
            throw new BadRequestError(`Database district query failed`);
        }
    }
}
