// app/api/rutas_peajes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
export async function POST(req: NextRequest) {
  try {
    const { ruta, nombre, ubicacion, costo } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO rutas_peajes (ruta, nombre, ubicacion, costo) VALUES (?, ?, ?, ?)',
      [ruta, nombre, ubicacion, costo]
    );

    return NextResponse.json({ id: result.insertId, ruta, nombre, ubicacion, costo });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rutas_peajes');
  
      return NextResponse.json(rows);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }