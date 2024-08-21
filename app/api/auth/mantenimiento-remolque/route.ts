import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

// Método para crear un nuevo mantenimiento de remolque
export async function POST(req: NextRequest) {
  try {
    const {
      id,
      remolque_id,
      tipo_mantenimiento,
      descripcion,
      fecha_mantenimiento,
      costo,
      ruta_pdf_mantenimiento,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO mantenimientos_remolques (
        id,
        remolque_id,
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento,
        costo,
        ruta_pdf_mantenimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        remolque_id,
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

// Método para obtener todos los mantenimientos de remolques
export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        mr.id,
        mr.remolque_id,
        r.nombre_transportista AS remolque,
        mr.tipo_mantenimiento,
        mr.descripcion,
        mr.fecha_mantenimiento,
        mr.costo,
        mr.ruta_pdf_mantenimiento
      FROM 
        mantenimientos_remolques mr
      JOIN 
        remolques r ON mr.remolque_id = r.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
