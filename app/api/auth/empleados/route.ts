// app/api/empleados/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
    try {
      const [rows] = await pool.query('SELECT * FROM empleados');
      return NextResponse.json(rows);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }

export async function POST(req: NextRequest) {
  try {
    const {
      folder,
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
    const tipo_empleado = 'Conductor';
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO empleados (
        tipo_empleado,
        folder,
        nombre, 
        fecha_nacimiento, 
        direccion, 
        celular, 
        tipo_licencia, 
        nro_licencia, 
        categoria, 
        fecha_venc_licencia, 
        fecha_venc_rcontrol, 
        fecha_venc_exmedico, 
        file_licencia, 
        file_r_control, 
        file_examen_medico
      ) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ tipo_empleado,
        folder,
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
      ]
    );

    return NextResponse.json({
      id: result.insertId,
      tipo_empleado,
      folder,
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
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
