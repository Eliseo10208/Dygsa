import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
    try {
        const {
            nombre_transportista,
            placa_rodaje,
            clase_vehiculo,
            nro_ejes,
            año_fabricacion,
            serie_chasis,
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
            pdf_tarjeta_propiedad,
        } = await req.json();

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO camiones (
        nombre_transportista,
        placa_rodaje,
        clase_vehiculo,
        nro_ejes,
        año_fabricacion,
        serie_chasis,
        seguro_compañia,
        fecha_pago_seguro,
        fecha_seguro,
        ruta_pdf_poliza_seguro,
        ruta_pdf_seguro_pago,
        fecha_cond_diso_emi,
        fecha_cond_diso_ven,
        ruta_pdf_cert_fisomeca,
        fecha_humo_diso_emi,
        fecha_humo_diso_ven,
        ruta_pdf_cert_humofisomeca,
        ruta_pdf_tarjeta_propiedad
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre_transportista,
                placa_rodaje,
                clase_vehiculo,
                nro_ejes,
                año_fabricacion,
                serie_chasis,
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
                pdf_tarjeta_propiedad,
            ]
        );

        return NextResponse.json({
            id: result.insertId,
            nombre_transportista,
            placa_rodaje,
            clase_vehiculo,
            nro_ejes,
            año_fabricacion,
            serie_chasis,
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
            pdf_tarjeta_propiedad,
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const [rows] = await pool.query("SELECT * FROM camiones");
        return NextResponse.json(rows);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
