import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/bc';
import { ResultSetHeader } from 'mysql2/promise';

// Handler for GET request to fetch all admin users
export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users');
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Handler for POST request to create a new admin user
export async function POST(req: NextRequest) {
  try {
    const { name, lastname, email, password, rol, registerdate } = await req.json();

    // Check if the email already exists
    const [existingUser] = await pool.query<any[]>('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'El correo electrónico ya está en uso' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO admin_users (name, lastname, email, password, rol, registerdate) VALUES (?, ?, ?, ?, ?, ?)',
      [name, lastname, email, hashedPassword, rol, registerdate]
    );

    return NextResponse.json({ id: result.insertId, name, lastname, email, rol, registerdate });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}