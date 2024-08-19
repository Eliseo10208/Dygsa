"use client";

import React, { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";

type Viaje = {
    id: number;
    nro_manifiesto: string;
    fecha_programacion: string;
    cliente: string;
    tn: number;
    servicio: string;
    empleado: string;
    camion: string;
    remolque: string | null;
    fecha_presentacion: string;
    hora_presentacion: string | null;
    lugar_carga: string | null;
    carga: string;
    observacion: string | null;
};

const ViajesPanel: React.FC = () => {
    const [viajes, setViajes] = useState<Viaje[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        const fetchViajes = async () => {
            try {
                const response = await axios.get("/api/auth/crear-orden-carga");
                setViajes(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchViajes();
    }, []);

    const filteredData = useMemo(
        () =>
            viajes.filter((viaje) =>
                Object.values(viaje).some((value) =>
                    value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            ),
        [viajes, searchTerm]
    );

    const columns: Column<Viaje>[] = useMemo(
        () => [
            { Header: "Nº Viaje", accessor: "nro_manifiesto" },
            { Header: "Fecha Carga", accessor: "fecha_programacion" },
            { Header: "Cliente", accessor: "cliente" },
            { Header: "Vehículo", accessor: "camion" },
            { Header: "Conductor", accessor: "empleado" },
            {
                Header: "Modificar",
                id: "modificar",
                Cell: ({ row }: { row: { original: Viaje } }) => (
                    <button
                        className="btn btn-warning"
                        onClick={() =>
                            router.push(
                                `/pages/viajes/editar/?id=${row.original.id}`
                            )
                        }
                    >
                        Editar
                    </button>
                ),
            },
            {
                Header: "Facturas",
                id: "facturas",
                Cell: ({ row }: { row: { original: Viaje } }) => (
                    <button
                        className="btn btn-success"
                        onClick={() =>
                            router.push(
                                `/pages/viajes/facturas?id=${row.original.id}`
                            )
                        }
                    >
                        Facturas
                    </button>
                ),
            },
            {
                Header: "Eliminar",
                id: "eliminar",
                Cell: ({ row }: { row: { original: Viaje } }) => (
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        Eliminar
                    </button>
                ),
            },
        ],
        [router]
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

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/auth/crear-orden-carga/${id}`);
            setViajes(viajes.filter((viaje) => viaje.id !== id));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const tableInstance = useTable<Viaje>({ columns, data: currentData });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(viajes);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Viajes");
        XLSX.writeFile(wb, "viajes.xlsx");
    };

    return (
        <>
            <div className="panel">
                <div className="panel-header">
                    <div className="title">
                        Lista de Cargas
                        <p>Administración de transporte de carga</p>
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
                                onClick={() =>
                                    router.push("/pages/viajes/crear")
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

export default ViajesPanel;
