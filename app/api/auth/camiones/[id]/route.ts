import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Handler for POST request to create a new truck
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

// Handler for GET request to get all trucks


// Handler for GET request to get a single truck by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM camiones WHERE id = ?", [id]);
        if (rows.length === 0) {
            return NextResponse.json({ message: "Camion not found" }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

// Handler for PUT request to update a truck
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
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
            `UPDATE camiones SET
                nombre_transportista = ?,
                placa_rodaje = ?,
                clase_vehiculo = ?,
                nro_ejes = ?,
                año_fabricacion = ?,
                serie_chasis = ?,
                seguro_compañia = ?,
                fecha_pago_seguro = ?,
                fecha_seguro = ?,
                ruta_pdf_poliza_seguro = ?,
                ruta_pdf_seguro_pago = ?,
                fecha_cond_diso_emi = ?,
                fecha_cond_diso_ven = ?,
                ruta_pdf_cert_fisomeca = ?,
                fecha_humo_diso_emi = ?,
                fecha_humo_diso_ven = ?,
                ruta_pdf_cert_humofisomeca = ?,
                ruta_pdf_tarjeta_propiedad = ?
            WHERE id = ?`,
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
                id
            ]
        );

        return NextResponse.json({
            id,
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

// Handler for DELETE request to delete a truck
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await pool.query<ResultSetHeader>('DELETE FROM camiones WHERE id = ?', [id]);

        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
