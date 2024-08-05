import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
    try {
        const [rows] = await pool.query('SELECT * FROM remolques');
        return NextResponse.json(rows);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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
        
        if (!nombre_transportista || !placa_rodaje || !marca || !seguro_compañia || !fecha_pago_seguro || !fecha_seguro || !fecha_cond_diso_emi || !fecha_cond_diso_ven || !fecha_humo_diso_emi || !fecha_humo_diso_ven) {
            throw new Error('Todos los campos son obligatorios');
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO remolques (
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
                pdf_informacion_remolque
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            ]
        );

        return NextResponse.json({
            id: result.insertId,
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
        console.error('Error in POST /api/remolques:', error);
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
