import { RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';
import { BadRequestError } from '../errors/BadRequestError';

export interface IVillage {
    sector_id: number;
    code: string;
    name: string;
}

export class Village {
    static async findSectorVillages(code: string) {

        try {
            const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM village WHERE SUBSTRING(code,1,4)=?`, [code]);

            return result as IVillage[];
        } catch (error) {
            console.error('Error fetching village:', error);
            throw new BadRequestError(`Database village query failed`);
        }
    }
}

