import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nombre_transportista,
      placa_rodaje,
      marca,
      seguro_compañia,
      fecha_pago_seguro,
      fecha_seguro,
      pdf_poliza_seguro,
      pdf_seguro_pago,
      fecha_cond_diso_emi,
      fecha_cond_diso_ven,
      pdf_cert_fisomeca,
      fecha_humo_diso_emi,
      fecha_humo_diso_ven,
      pdf_cert_humofisomeca,
      pdf_informacion_remolque,
    } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE remolques SET
        nombre_transportista = ?,
        placa_rodaje = ?,
        marca = ?,
        seguro_compañia = ?,
        fecha_pago_seguro = ?,
        fecha_seguro = ?,
        pdf_poliza_seguro = ?,
        pdf_seguro_pago = ?,
        fecha_cond_diso_emi = ?,
        fecha_cond_diso_ven = ?,
        pdf_cert_fisomeca = ?,
        fecha_humo_diso_emi = ?,
        fecha_humo_diso_ven = ?,
        pdf_cert_humofisomeca = ?,
        pdf_informacion_remolque = ?
      WHERE id = ?`,
      [
        nombre_transportista,
        placa_rodaje,
        marca,
        seguro_compañia,
        fecha_pago_seguro,
        fecha_seguro,
        pdf_poliza_seguro,
        pdf_seguro_pago,
        fecha_cond_diso_emi,
        fecha_cond_diso_ven,
        pdf_cert_fisomeca,
        fecha_humo_diso_emi,
        fecha_humo_diso_ven,
        pdf_cert_humofisomeca,
        pdf_informacion_remolque,
        params.id,
      ]
    );

    return NextResponse.json({
      id: params.id,
      nombre_transportista,
      placa_rodaje,
      marca,
      seguro_compañia,
      fecha_pago_seguro,
      fecha_seguro,
      pdf_poliza_seguro,
      pdf_seguro_pago,
      fecha_cond_diso_emi,
      fecha_cond_diso_ven,
      pdf_cert_fisomeca,
      fecha_humo_diso_emi,
      fecha_humo_diso_ven,
      pdf_cert_humofisomeca,
      pdf_informacion_remolque,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM remolques WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Remolque no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Remolque eliminado exitosamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM remolques WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Remolque no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
