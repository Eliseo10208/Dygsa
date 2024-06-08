// app/api/rutas/combinadas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        r.origen AS Origen, 
        r.destino AS Destino, 
        r.kms AS KMS, 
        COUNT(p.id) AS \`Nro. peajes\`, 
        COALESCE(SUM(p.costo), 0) AS \`Costo peaje\`, 
        r.combustible AS Combustible
      FROM 
        rutas r
      LEFT JOIN 
        rutas_peajes p ON r.id = p.ruta
      GROUP BY 
        r.id`
    );

    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
