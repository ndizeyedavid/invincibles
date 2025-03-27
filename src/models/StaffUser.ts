// models/StaffUser.ts
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';

export interface IStaffUser {
    user_id?: string;
    staff_code?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone_number: string;
    email: string;
    nid_number?: string;
    passport_number?: string;
    gender?: string;
    nationality?: string;
    dob?: string;
    martial_status?: string;
    residence?: string;
    bank_name?: string;
    account_number?: string;
    rssb_number?: string;
    password?: string;
    status?: 'ACTIVE' | 'DISABLED';
    created_at?: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;
}

export class StaffUser {
    // Create a new staff user
    static async create(user: IStaffUser): Promise<ResultSetHeader> {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO staff_user (
                staff_code, first_name, middle_name, last_name, 
                phone_number, email, nid_number, passport_number,
                gender, nationality, dob, martial_status,
                residence, bank_name, account_number, rssb_number,
                password, created_at, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
            [
                user.staff_code, user.first_name, user.middle_name, user.last_name,
                user.phone_number, user.email, user.nid_number, user.passport_number,
                user.gender, user.nationality, user.dob, user.martial_status,
                user.residence, user.bank_name, user.account_number, user.rssb_number,
                user.password, user.created_by
            ]
        );
        return result;
    }

    // Find user by ID
    static async findById(userId: string): Promise<IStaffUser | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM staff_user WHERE user_id = ? AND status = 'ACTIVE'`,
            [userId]
        );
        return rows[0] as IStaffUser || null;
    }

    // Find user by email
    static async findByEmail(email: string): Promise<IStaffUser | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM staff_user WHERE email = ? AND status = 'ACTIVE'`,
            [email]
        );
        return rows[0] as IStaffUser || null;
    }

    // Get all active users
    static async findAll(search?: string): Promise<IStaffUser[]> {
        let query = `SELECT * FROM staff_user WHERE status = 'ACTIVE'`;
        const params: any[] = [];

        if (search) {
            query += ` AND (
                first_name LIKE ? OR 
                last_name LIKE ? OR 
                email LIKE ? OR 
                phone_number LIKE ? OR 
                staff_code LIKE ?
            )`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        return rows as IStaffUser[];
    }

    // Update user details
    static async update(userId: string, data: Partial<IStaffUser>): Promise<ResultSetHeader> {
        const updateFields = [];
        const values = [];

        // Build dynamic update query based on provided fields
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'user_id' && key !== 'created_at' && key !== 'created_by') {
                updateFields.push(`${key} = ?`);
                values.push(value);
            }
        }

        values.push(data.updated_by);
        values.push(userId);

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE staff_user 
             SET ${updateFields.join(', ')}, updated_at = NOW(), updated_by = ?
             WHERE user_id = ?`,
            values
        );
        return result;
    }

    // Update password
    static async updatePassword(userId: string, password: string, updatedBy: string): Promise<ResultSetHeader> {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE staff_user 
             SET password = ?, updated_at = NOW(), updated_by = ?
             WHERE user_id = ?`,
            [password, updatedBy, userId]
        );
        return result;
    }

    // Soft delete user
    static async delete(userId: string, deletedBy: string): Promise<ResultSetHeader> {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE staff_user 
             SET status = 'DISABLED', 
                 updated_at = NOW(), 
                 updated_by = ?
             WHERE user_id = ?`,
            [deletedBy, userId]
        );
        return result;
    }

    // Get user profile with employment and position details
    static async getUserProfile(userId: string): Promise<any> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                su.*,
                se.employment_id,
                se.position_id,
                se.start_date as employment_start_date,
                se.end_date as employment_end_date,
                se.is_active as employment_status,
                se.is_acting,
                sp.position_name,
                sp.is_line_manager,
                sj.job_family,
                su2.unit_name as unit,
                su3.unit_name as report_unit
            FROM 
                staff_user su
            LEFT JOIN staff_employment se ON su.user_id = se.user_id
            LEFT JOIN staff_position sp ON se.position_id = sp.position_id
            LEFT JOIN staff_job_family sj ON sp.job_family_id = sj.job_family_id
            LEFT JOIN staff_unit su2 ON sp.unit_id = su2.unit_id
            LEFT JOIN staff_unit su3 ON sp.report_unit_id = su3.unit_id
            WHERE 
                su.user_id = ? AND su.status = 'ACTIVE'
            ORDER BY 
                se.is_active DESC, se.start_date DESC
            LIMIT 1`,
            [userId]
        );
        return rows[0] || null;
    }

    // Check if email exists
    static async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
        let query = 'SELECT COUNT(*) as count FROM staff_user WHERE email = ? AND status = "ACTIVE"';
        const params: any[] = [email];

        if (excludeUserId) {
            query += ' AND user_id != ?';
            params.push(excludeUserId);
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        return rows[0].count > 0;
    }

    // Check if phone number exists
    static async phoneExists(phone: string, excludeUserId?: string): Promise<boolean> {
        let query = 'SELECT COUNT(*) as count FROM staff_user WHERE phone_number = ? AND status = "ACTIVE"';
        const params: any[] = [phone];

        if (excludeUserId) {
            query += ' AND user_id != ?';
            params.push(excludeUserId);
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        return rows[0].count > 0;
    }
}

export default StaffUser;