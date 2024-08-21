"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

type Mantenimiento = {
    id: string;
    camion_id: string;
    tipo_mantenimiento: string;
    descripcion: string;
    fecha_mantenimiento: string;
    costo: number;
    ruta_pdf_mantenimiento: string;
};

const MantenimientosPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const searchParams = useSearchParams();
    const camionId = searchParams.get('id');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/auth/mantenimiento-camion/camion_id/${camionId}`);
                setMantenimientos(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const filteredData = useMemo(
        () =>
            mantenimientos.filter((mantenimiento) =>
                Object.values(mantenimiento).some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            ),
        [mantenimientos, searchTerm]
    );

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/auth/mantenimiento-camion/${id}`);
            setMantenimientos(mantenimientos.filter((mantenimiento) => mantenimiento.id !== id));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const columns: Column<Mantenimiento>[] = useMemo(
        () => [
            { Header: "", accessor: "id", Cell: () => null },
            { Header: "Tipo Mantenimiento", accessor: "tipo_mantenimiento" },
            { Header: "Descripción", accessor: "descripcion" },
            { Header: "Fecha Mantenimiento", accessor: "fecha_mantenimiento" },
            { Header: "Costo", accessor: "costo" },
            {
                Header: "Editar",
                id: "edit",
                Cell: ({ row }: { row: { original: Mantenimiento } }) => (
                    <button
                        className="btn btn-warning"
                        onClick={() =>
                            router.push(
                                `/pages/unidades/vehiculos/mto/edit?id=${row.original.id}`
                            )
                        }
                    >
                        <i className="fas fa-edit"></i> Editar
                    </button>
                ),
            },
            {
                Header: "Descargar",
                id: "descargar",
                Cell: ({ row }: { row: { original: Mantenimiento } }) => (
                    <a
                        className="btn btn-primary"
                        download="mantenimiento"
                        href={row.original.ruta_pdf_mantenimiento}
                    >
                        Descargar
                    </a>
                ),
            },
            {
                Header: "Eliminar",
                id: "eliminar",
                Cell: ({ row }: { row: { original: Mantenimiento } }) => (
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        Eliminar
                    </button>
                ),
            },
        ],
        []
    );

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
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

    const tableInstance = useTable<Mantenimiento>({ columns, data: mantenimientos });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(mantenimientos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Mantenimientos");
        XLSX.writeFile(wb, "mantenimientos.xlsx");
    };

    return (
        <>
            <div className="panel">
                <button
                    className="back_btn"
                    onClick={() => window.history.back()}
                >
                    Regresar
                </button>
                <div className="panel-header">
                    <div className="title">
                        Lista de mantenimientos
                        <p>Administración de transporte de carga</p>
                    </div>
                    <div className="buttons">
                        <div className="column"></div>
                        <div className="column">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    router.push(`/pages/unidades/vehiculos/mto/create?id=${camionId}`)
                                }
                            >
                                Crear nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6"></div>
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
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
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
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
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

export default MantenimientosPanel;
