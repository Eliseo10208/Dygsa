// app/api/rutas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { origen, destino, kms, combustible } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO rutas (origen, destino, kms, combustible) VALUES (?, ?, ?, ?)',
      [origen, destino, kms, combustible]
    );

    return NextResponse.json({ id: result.insertId, origen, destino, kms, combustible });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
    try {
      const [rows] = await pool.query('SELECT * FROM rutas');
      return NextResponse.json(rows);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }