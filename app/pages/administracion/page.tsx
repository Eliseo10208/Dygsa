'use client';

import React, { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from 'sweetalert2';

type AdminUser = {
    id: number;
    name: string;
    lastname: string;
    email: string;
    rol: string;
    registerdate: string;
};

const AdminUsersPanel: React.FC = () => {
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchAdminUsers = async () => {
            try {
                const response = await axios.get("/api/auth/adminuser");
                setAdminUsers(response.data);
            } catch (error) {
                console.error("Error fetching admin users:", error);
                Swal.fire('Error', 'Hubo un problema al obtener los usuarios.', 'error');
            }
        };

        fetchAdminUsers();
    }, []);

    const filteredData = useMemo(
        () =>
            adminUsers.filter((adminUser) =>
                Object.values(adminUser).some((value) =>
                    value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [adminUsers, searchTerm]
    );

    const columns: Column<AdminUser>[] = useMemo(
        () => [
            { Header: "Nombre", accessor: "name" },
            { Header: "Apellido", accessor: "lastname" },
            { Header: "Email", accessor: "email" },
            { Header: "Rol", accessor: "rol" },
            { Header: "Fecha de Registro", accessor: "registerdate" },
            {
                Header: "Modificar",
                id: "modificar",
                Cell: ({ row }: { row: { original: AdminUser } }) => (
                    <button
                        className="btn btn-warning"
                        onClick={() => router.push(`/pages/administracion/edit/?id=${row.original.id}`)}
                    >
                        <i className="fas fa-edit"></i> Modificar
                    </button>
                ),
            },
            {
                Header: "Eliminar",
                id: "eliminar",
                Cell: ({ row }: { row: { original: AdminUser } }) => (
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <i className="fas fa-trash"></i> Eliminar
                    </button>
                ),
            },
        ],
        [router]
    );

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/auth/adminuser/${id}`);
                    if (response.status === 200) {
                        setAdminUsers(adminUsers.filter((adminUser) => adminUser.id !== id));
                        Swal.fire('Eliminado', response.data.message, 'success');
                    } else {
                        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
                    }
                } catch (error) {
                    console.error("Error deleting admin user:", error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
                }
            }
        });
    };

    const tableInstance = useTable<AdminUser>({ columns, data: filteredData });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(adminUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AdminUsers");
        XLSX.writeFile(wb, "admin_users.xlsx");
    };

    const handlePageChange = (direction: string) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "previous" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="panel">
                <div className="panel-header">
                    <div className="title">
                        Lista de Administradores
                        <p>Administración de Usuarios</p>
                    </div>
                    <div className="buttons">
                        <div className="column">
                            <button
                                className="btn btn-green2"
                                onClick={exportTableToExcel}
                            >
                                Descargar Excel
                            </button>
                        </div>
                        <div className="column">
                            <button
                                className="btn btn-primary"
                                onClick={() => router.push("/pages/administracion/crear")}
                            >
                                Crear nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>
                            Mostrar
                            <select
                                name="table_id3_length"
                                aria-controls="table_id3"
                                className="form-select d-inline-block w-auto ms-2"
                                value={itemsPerPage}
                                onChange={(e) =>
                                    setItemsPerPage(parseInt(e.target.value))
                                }
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>{" "}
                            objetos
                        </label>
                    </div>
                    <div className="col-md-6 text-end">
                        <label>
                            Buscar:
                            <input
                                type="search"
                                aria-controls="table_id3"
                                className="form-control d-inline-block w-auto ms-2"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </label>
                    </div>
                </div>

                <table
                    {...getTableProps()}
                    id="table_id3"
                    className="table table-striped table-bordered nowrap"
                    style={{ width: "100%" }}
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-secondary"
                        aria-controls="table_id3"
                        tabIndex={-1}
                        id="table_id3_previous"
                        onClick={() => handlePageChange("previous")}
                        disabled={currentPage === 1}
                    >
                        Atrás
                    </button>
                    <div>
                        <a
                            className="btn btn-primary active"
                            aria-controls="table_id3"
                            tabIndex={0}
                        >
                            Página {currentPage}
                        </a>
                    </div>
                    <button
                        className="btn btn-secondary"
                        aria-controls="table_id3"
                        tabIndex={-1}
                        id="table_id3_next"
                        onClick={() => handlePageChange("next")}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminUsersPanel;
