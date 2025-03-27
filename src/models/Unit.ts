import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';

export interface IUnit {
    unit_id?: number;
    unit_name: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    created_by?: number;
    updated_by?: number;
    deleted_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export class Unit {
    static async create(unit: IUnit) {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO unit (unit_name, description, created_by)
             VALUES (?, ?, ?)`,
            [unit.unit_name, unit.description, unit.created_by]
        );
        return result;
    }

    static async findById(unitId: number) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM unit WHERE unit_id = ? AND status = 'ACTIVE'`,
            [unitId]
        );
        return rows[0] as IUnit;
    }

    static async findAll() {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM unit WHERE status = 'ACTIVE' AND deleted_at IS NULL`
        );
        return rows as IUnit[];
    }

    static async update(unitId: number, unit: Partial<IUnit>) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE unit 
             SET unit_name = ?, description = ?, updated_by = ?
             WHERE unit_id = ?`,
            [unit.unit_name, unit.description, unit.updated_by, unitId]
        );
        return result;
    }

    static async delete(unitId: number, userId: number) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE unit 
             SET status = 'INACTIVE', deleted_at = CURRENT_TIMESTAMP, updated_by = ? 
             WHERE unit_id = ?`,
            [userId, unitId]
        );
        return result;
    }
}

export default Unit;