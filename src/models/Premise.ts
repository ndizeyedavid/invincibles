import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/dbConnection';

export interface IPremise {
  applicant_id: number;
  premise_name: string;
  country_id: string;
  village_id: string;
  physical_address: string;
  street_address: string;
  latitude: string;
  longitude: string;
}

export class Premise {
  static async create(premise: IPremise) {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO premise (applicant_id,premise_name, country_id, village_id, physical_address, street_address, latitude, longitude)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        premise.applicant_id,
        premise.premise_name,
        premise.country_id,
        premise.village_id,
        premise.physical_address,
        premise.street_address,
        premise.latitude,
        premise.longitude,
      ]
    );
    return result;
  }

  static async findApplicantPremise(applicant_id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
        SELECT 
        p.applicant_id,
        p.premise_name, p.country_id, 
        c.country_name,
        d.code as district_code,
        d.name as district_code,
        s.code as sector_code,
        d.name as sector_code,
        v.code as village_code,
        v.name as village_name,
        p.physical_address, 
        p.street_address, 
        p.latitude, 
        p.longitude 
        FROM 
        premise p
        LEFT JOIN country c ON p.country_id=c.country_id
        LEFT JOIN village v ON p.village_id=v.id
        LEFT JOIN sector s ON v.code=SUBSTRING(s.code,1,4)
        LEFT JOIN district d ON d.code=SUBSTRING(d.code,1,2)
        WHERE p.applicant_id = ?
            `,
      [applicant_id]
    );
    return rows as IPremise[];
  }
}

export default Premise;
