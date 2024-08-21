import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mantenimientos_remolques WHERE remolque_id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Mantenimiento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
