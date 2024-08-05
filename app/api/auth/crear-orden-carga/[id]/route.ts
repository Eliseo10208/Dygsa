// app/api/auth/ordenes-carga/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Método para editar una orden de carga
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nro_manifiesto,
      cliente,
      empleado,
      camion,
      remolque,
      tn,
      servicio,
      fecha_programacion,
      fecha_presentacion,
      hora_presentacion,
      lugar_carga,
      carga,
      observacion,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ordenes_carga SET
        nro_manifiesto = ?,
        cliente_id = ?,
        conductor_id = ?,
        camion_id = ?,
        remolque_id = ?,
        tn = ?,
        servicio = ?,
        fecha_programacion = ?,
        fecha_presentacion = ?,
        hora_presentacion = ?,
        lugar_carga = ?,
        carga = ?,
        observacion = ?
      WHERE id = ?`,
      [
        nro_manifiesto,
        cliente,
        empleado,
        camion,
        remolque || null,
        tn,
        servicio,
        fecha_programacion,
        fecha_presentacion,
        hora_presentacion || null,
        lugar_carga || null,
        carga,
        observacion || null,
        params.id,
      ]
    );

    return NextResponse.json({ status: 'success', id: params.id });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para eliminar una orden de carga
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM ordenes_carga WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Orden de carga no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Orden de carga eliminada exitosamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para obtener una orden de carga por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ordenes_carga WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Orden de carga no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
