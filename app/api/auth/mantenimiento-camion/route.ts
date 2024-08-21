import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

// Método para crear un nuevo mantenimiento
export async function POST(req: NextRequest) {
  try {
    const {
      id,
      camion_id,
      tipo_mantenimiento,
      descripcion,
      fecha_mantenimiento,
      costo,
      ruta_pdf_mantenimiento,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO mantenimientos (
        id,
        camion_id,
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento,
        costo,
        ruta_pdf_mantenimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        camion_id,
        tipo_mantenimiento,
        descripcion || null,
        fecha_mantenimiento,
        costo,
        ruta_pdf_mantenimiento || null,
      ]
    );

    return NextResponse.json({ status: 'success', id: result.insertId });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para obtener todos los mantenimientos
export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.id,
        m.camion_id,
        c.nombre_transportista AS camion,
        m.tipo_mantenimiento,
        m.descripcion,
        m.fecha_mantenimiento,
        m.costo,
        m.ruta_pdf_mantenimiento
      FROM 
        mantenimientos m
      JOIN 
        camiones c ON m.camion_id = c.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
