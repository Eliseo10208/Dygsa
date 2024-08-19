// app/api/auth/facturas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Método para editar una factura
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nro_factura,
      orden_carga_id,
      monto,
      monto_iva,
      monto_retencion,
      total,
      pdf_url
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE facturas SET
        nro_factura = ?,
        orden_carga_id = ?,
        monto = ?,
        monto_iva = ?,
        monto_retencion = ?,
        total = ?,
        pdf_url = ?
      WHERE id = ?`,
      [
        nro_factura,
        orden_carga_id,
        monto,
        monto_iva,
        monto_retencion,
        total,
        pdf_url || null,
        params.id,
      ]
    );

    return NextResponse.json({ status: 'success', id: params.id });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para eliminar una factura
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM facturas WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Factura no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Factura eliminada exitosamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Método para obtener una factura por ID


  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM facturas WHERE id = ?', [params.id]);
  
      if (rows.length === 0) {
        return NextResponse.json({ message: 'Factura no encontrada' }, { status: 404 });
      }
  
      return NextResponse.json(rows);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }
