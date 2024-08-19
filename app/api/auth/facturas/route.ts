// app/api/auth/facturas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      nro_factura,
      orden_carga_id,
      monto,
      monto_iva,
      monto_retencion,
      total,
      pdf_url
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO facturas (
        id,
        nro_factura,
        orden_carga_id,
        monto,
        monto_iva,
        monto_retencion,
        total,
        pdf_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        nro_factura,
        orden_carga_id,
        monto,
        monto_iva,
        monto_retencion,
        total,
        pdf_url || null,
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
        f.id,
        f.nro_factura,
        f.orden_carga_id,
        oc.nro_manifiesto AS orden_carga,
        f.monto,
        f.monto_iva,
        f.monto_retencion,
        f.total,
        f.pdf_url
      FROM 
        facturas f
      JOIN 
        ordenes_carga oc ON f.orden_carga_id = oc.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
