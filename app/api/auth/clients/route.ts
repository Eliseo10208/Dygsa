// app/api/clientes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db'; // Asegúrate de que esta sea la ruta correcta a tu archivo de configuración de la base de datos
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { nombre, direccion, distrito, provincia, telefono, ruc } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO clientes (nombre, direccion, distrito, provincia, telefono, ruc) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, direccion, distrito, provincia, telefono, ruc || null]
    );

    return NextResponse.json({ id: result.insertId, nombre, direccion, distrito, provincia, telefono, ruc });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET() {
    try{
        const [clientes] = await pool.query('SELECT * FROM clientes');
        return NextResponse.json(clientes);
    }catch(error){
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
