// app/api/rutas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rutas WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Ruta no encontrada' }, { status: 404 });
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
        'DELETE FROM rutas WHERE id = ?',
        [params.id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Ruta no encontrada' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Ruta eliminada exitosamente' });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { origen, destino, kms, combustible } = await req.json();
  
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE rutas SET
          origen = ?,
          destino = ?,
          kms = ?,
          combustible = ?
        WHERE id = ?`,
        [origen, destino, kms, combustible, params.id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Ruta no encontrada' }, { status: 404 });
      }
  
      return NextResponse.json({ id: params.id, origen, destino, kms, combustible });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }