import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Método para obtener un mantenimiento por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mantenimientos WHERE id = ?', [params.id]);
  
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Mantenimiento no encontrado' }, { status: 404 });
    }
  
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para actualizar un mantenimiento
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      camion_id,
      tipo_mantenimiento,
      descripcion,
      fecha_mantenimiento,
      costo,
      ruta_pdf_mantenimiento,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE mantenimientos SET
        camion_id = ?,
        tipo_mantenimiento = ?,
        descripcion = ?,
        fecha_mantenimiento = ?,
        costo = ?,
        ruta_pdf_mantenimiento = ?
      WHERE id = ?`,
      [
        camion_id,
        tipo_mantenimiento,
        descripcion || null,
        fecha_mantenimiento,
        costo,
        ruta_pdf_mantenimiento || null,
        params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Mantenimiento no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', id: params.id });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para eliminar un mantenimiento
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM mantenimientos WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Mantenimiento no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Mantenimiento eliminado exitosamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
