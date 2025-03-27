// src/models/Position.ts
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';
import { BadRequestError } from '../errors/BadRequestError';

export interface ISector {
    sector_id: number;
    code: string;
    name: string;
}

export class Sector {
    static async findDistrictSectors(code: string) {
        try {
            const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM sector WHERE SUBSTRING(code,1,2)=?`, [code]);

            return result as ISector[];
        } catch (error) {
            console.error('Error fetching sector:', error);
            throw new BadRequestError(`Database sector query failed`);
        }
    }
}
