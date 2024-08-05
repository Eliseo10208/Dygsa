// app/api/auth/crear-orden-carga/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
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
      `INSERT INTO ordenes_carga (
        nro_manifiesto,
        cliente_id,
        conductor_id,
        camion_id,
        remolque_id,
        tn,
        servicio,
        fecha_programacion,
        fecha_presentacion,
        hora_presentacion,
        lugar_carga,
        carga,
        observacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    return NextResponse.json({ status: 'success', id: result.insertId });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        oc.id, 
        oc.nro_manifiesto, 
        oc.fecha_programacion, 
        c.nombre AS cliente, 
        oc.tn, 
        oc.servicio, 
        e.nombre AS empleado, 
        cam.nombre_transportista AS camion, 
        rem.nombre_transportista AS remolque, 
        oc.fecha_presentacion, 
        oc.hora_presentacion, 
        oc.lugar_carga, 
        oc.carga, 
        oc.observacion 
      FROM 
        ordenes_carga oc
      JOIN 
        clientes c ON oc.cliente_id = c.id
      JOIN 
        empleados e ON oc.conductor_id = e.id
      JOIN 
        camiones cam ON oc.camion_id = cam.id
      LEFT JOIN 
        remolques rem ON oc.remolque_id = rem.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
