import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';

export interface IStaffPosition {
    staff_position_id?: number;
    staff_position_name: string;
    description?: string;
    report_unit_id?: number;
    is_line_manager?: 'YES' | 'NO';
    unit_id: number;
    job_family_id: number;
    status?: 'ACTIVE' | 'INACTIVE';
    created_by?: number;
    updated_by?: number;
    deleted_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export class StaffPosition {
    static async create(position: IStaffPosition) {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO staff_position (
                staff_position_name, description, report_unit_id, 
                is_line_manager, unit_id, job_family_id, created_by
             ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                position.staff_position_name,
                position.description,
                position.report_unit_id,
                position.is_line_manager || 'NO',
                position.unit_id,
                position.job_family_id,
                position.created_by
            ]
        );
        return result;
    }

    static async findById(positionId: number) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                sp.*, u.unit_name, jf.job_family
             FROM 
                staff_position sp
                JOIN unit u ON sp.unit_id = u.unit_id
                JOIN job_family jf ON sp.job_family_id = jf.job_family_id
             WHERE 
                sp.staff_position_id = ? 
                AND sp.status = 'ACTIVE'`,
            [positionId]
        );
        return rows[0] as IStaffPosition & { unit_name: string, job_family: string };
    }

    static async findAll() {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                sp.*, u.unit_name, jf.job_family
             FROM 
                staff_position sp
                JOIN unit u ON sp.unit_id = u.unit_id
                JOIN job_family jf ON sp.job_family_id = jf.job_family_id
             WHERE 
                sp.status = 'ACTIVE' 
                AND sp.deleted_at IS NULL`
        );
        return rows as (IStaffPosition & { unit_name: string, job_family: string })[];
    }

    static async update(positionId: number, position: Partial<IStaffPosition>) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE staff_position 
             SET staff_position_name = ?, description = ?, report_unit_id = ?,
                 is_line_manager = ?, unit_id = ?, job_family_id = ?, updated_by = ?
             WHERE staff_position_id = ?`,
            [
                position.staff_position_name,
                position.description,
                position.report_unit_id,
                position.is_line_manager,
                position.unit_id,
                position.job_family_id,
                position.updated_by,
                positionId
            ]
        );
        return result;
    }

    static async delete(positionId: number, userId: number) {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE staff_position 
             SET status = 'INACTIVE', deleted_at = CURRENT_TIMESTAMP, updated_by = ? 
             WHERE staff_position_id = ?`,
            [userId, positionId]
        );
        return result;
    }
}

export default StaffPosition;