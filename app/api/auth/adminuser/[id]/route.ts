import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword } from "@/lib/bc";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Handler for GET request to fetch a user by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        const [userRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );

        if (userRows.length === 0) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        const user = userRows[0];
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

// Handler for POST request to create a new admin user
export async function POST(req: NextRequest) {
    try {
        const { name, lastname, email, password, rol, registerdate } =
            await req.json();
        const hashedPassword = await hashPassword(password);

        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO admin_users (name, lastname, email, password, rol, registerdate) VALUES (?, ?, ?, ?, ?, ?)",
            [name, lastname, email, hashedPassword, rol, registerdate]
        );

        return NextResponse.json({
            id: result.insertId,
            name,
            lastname,
            email,
            rol,
            registerdate,
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

// Handler for PUT request to update an admin user
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { name, lastname, email, password, rol, registerdate } =
            await req.json();
        const hashedPassword = await hashPassword(password);

        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE admin_users SET name = ?, lastname = ?, email = ?, password = ?, rol = ?, registerdate = ? WHERE id = ?",
            [name, lastname, email, hashedPassword, rol, registerdate, id]
        );

        return NextResponse.json({
            id,
            name,
            lastname,
            email,
            rol,
            registerdate,
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

// Handler for DELETE request to delete an admin user
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Obtener la información del usuario antes de eliminarlo
        const [userRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );

        if (userRows.length === 0) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        const user = userRows[0];

        await pool.query<ResultSetHeader>(
            "DELETE FROM admin_users WHERE id = ?",
            [id]
        );

        return NextResponse.json({ message: `El usuario ${user.name} ${user.lastname} ha sido eliminado.` }, { status: 200 });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
