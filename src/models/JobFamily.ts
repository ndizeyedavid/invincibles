import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';

export interface IJobFamily {
    job_family_id?: number;
    job_family: string;
    status?: 'ACTIVE' | 'INACTIVE';
    created_by?: number;
    updated_by?: number;
    deleted_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export class JobFamily {
    static async create(jobFamily: IJobFamily) {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO job_family (job_family, created_by)
             VALUES (?, ?)`,
            [jobFamily.job_family, jobFamily.created_by]
        );
        return result;
    }

    static async findById(jobFamilyId: number) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM job_family WHERE job_family_id = ? AND status = 'ACTIVE'`,
            [jobFamilyId]
        );
        return rows[0] as IJobFamily;
    }

    static async findAll() {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM job_family WHERE status = 'ACTIVE' AND deleted_at IS NULL`
        );
        return rows as IJobFamily[];
    }

    static async update(jobFamilyId: number, jobFamily: Partial<IJobFamily>) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE job_family 
             SET job_family = ?, updated_by = ?
             WHERE job_family_id = ?`,
            [jobFamily.job_family, jobFamily.updated_by, jobFamilyId]
        );
        return result;
    }

    static async delete(jobFamilyId: number, userId: number) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE job_family 
             SET status = 'INACTIVE', deleted_at = CURRENT_TIMESTAMP, updated_by = ? 
             WHERE job_family_id = ?`,
            [userId, jobFamilyId]
        );
        return result;
    }
}

export default JobFamily;