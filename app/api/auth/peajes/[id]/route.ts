import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rutas_peajes WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Peaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM rutas_peajes WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Peaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Peaje eliminado exitosamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { ruta, nombre, ubicacion, costo } = await req.json();
  
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE rutas_peajes SET
          ruta = ?,
          nombre = ?,
          ubicacion = ?,
          costo = ?
        WHERE id = ?`,
        [ruta, nombre, ubicacion, costo, params.id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Peaje no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json({ id: params.id, ruta, nombre, ubicacion, costo });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }