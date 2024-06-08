// app/api/empleados/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nombre,
      fecha_nacimiento,
      direccion,
      telefono,
      tipo_licencia,
      nro_licencia,
      categoria,
      fecha_venc_licencia,
      fecha_venc_rcontrol,
      fecha_venc_exmedico,
      file_licencia,
      file_r_control,
      file_examen_medico,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE empleados SET
        nombre = ?,
        fecha_nacimiento = ?,
        direccion = ?,
        celular = ?,
        tipo_licencia = ?,
        nro_licencia = ?,
        categoria = ?,
        fecha_venc_licencia = ?,
        fecha_venc_rcontrol = ?,
        fecha_venc_exmedico = ?,
        file_licencia = ?,
        file_r_control = ?,
        file_examen_medico = ?
      WHERE id = ?`,
      [
        nombre,
        fecha_nacimiento,
        direccion,
        telefono,
        tipo_licencia,
        nro_licencia,
        categoria,
        fecha_venc_licencia,
        fecha_venc_rcontrol,
        fecha_venc_exmedico,
        file_licencia ? 1 : 0,
        file_r_control ? 1 : 0,
        file_examen_medico ? 1 : 0,
        params.id,
      ]
    );

    return NextResponse.json({ id: params.id, nombre, fecha_nacimiento, direccion, telefono, tipo_licencia, nro_licencia, categoria, fecha_venc_licencia, fecha_venc_rcontrol, fecha_venc_exmedico, file_licencia, file_r_control, file_examen_medico });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM empleados WHERE id = ?',
        [params.id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empleados WHERE id = ?', [params.id]);
  
      if (rows.length === 0) {
        return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(rows[0]);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }