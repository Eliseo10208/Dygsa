import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Importa los tipos correctos
import pool from '@/lib/db'; // Ajusta la ruta según sea necesario


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nombre, direccion, distrito, provincia, telefono FROM clientes WHERE id = ?', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }
  
  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const { nombre, direccion, distrito, provincia, telefono } = await req.json();
  
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'UPDATE clientes SET nombre = ?, direccion = ?, distrito = ?, provincia = ?, telefono = ? WHERE id = ?',
        [nombre, direccion, distrito, provincia, telefono, id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
      }
  
      return NextResponse.json({ status: 'success' });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }
  
