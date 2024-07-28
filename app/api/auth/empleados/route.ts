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
            file_examen_medico,
        } = await req.json();
        
        if (!nombre || !fecha_nacimiento || !direccion || !celular || !tipo_licencia || !nro_licencia || !categoria || !fecha_venc_licencia || !fecha_venc_rcontrol || !fecha_venc_exmedico) {
            throw new Error('Todos los campos son obligatorios');
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO empleados (
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
                file_examen_medico,
            ]
        );

        return NextResponse.json({
            id: result.insertId,
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
            file_examen_medico,
        });
    } catch (error) {
        console.error('Error in POST /api/empleados:', error);
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
