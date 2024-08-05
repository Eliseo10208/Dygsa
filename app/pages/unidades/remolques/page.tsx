"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";

type Remolque = {
    id: number;
    nombre_transportista: string;
    placa_rodaje:string;
    marca: string;
};

const RemolquesPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [data, setData] = useState<Remolque[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/auth/remolques');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, []);

    const filteredData = useMemo(
        () =>
                data.filter((remolque) =>
                Object.values(remolque).some((value) =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Remolque>[] = useMemo(
        () => [
            { Header: "", accessor: "id", Cell: () => null },
            { Header: "Nombre Transportista", accessor: "nombre_transportista" },
            { Header: "Placa Rodaje", accessor: "placa_rodaje" },
            { Header: "Marca", accessor: "marca" },
            {
                Header: "Editar",
                id: "editar",
                Cell: ({ row }: { row: { original: Remolque } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => router.push(`/pages/unidades/remolques/edit`)}
                    >
                        <i className="fas fa-edit"></i> Editar
                    </button>
                ),
            },
            {
                Header: "Ver más",
                id: "verMas",
                Cell: ({ row }: { row: { original: Remolque } }) => (
                    <button
                        className="table_buttons blue"
                        onClick={() => router.push(`/pages/unidades/remolques/edit${row.original.id}`)}
                    >
                        <i className="fas fa-eye"></i> Ver más
                    </button>
                ),
            },
            {
                Header: "Mto.",
                id: "mantenimiento",
                Cell: ({ row }: { row: { original: Remolque } }) => (
                    <button
                        className="table_buttons green"
                        onClick={() => router.push(`/pages/vehiculos/mantenimiento/${row.original.id}`)}
                    >
                        <i className="fas fa-wrench"></i> Mto.
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

    const router = useRouter();

    const tableInstance = useTable<Remolque>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Remolques");
        XLSX.writeFile(wb, "remolques.xlsx");
    };

    return (
        <>
            <div className="panel">
                <div className="panel-header">
                    <div className="title">
                        Lista de Remolques
                        <p>Administración de remolques</p>
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
                                onClick={() => router.push(`/pages/unidades/remolques/crear`)}
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
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {currentData.map((remolque) => (
                            <tr key={remolque.id}>
                                <td className="dtr-control"></td>
                                <td>{remolque.nombre_transportista}</td>
                                <td>{remolque.placa_rodaje}</td>
                                <td>{remolque.marca}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => router.push(`/pages/unidades/remolques/edit/?id=${remolque.id}`)}
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => router.push(`/pages/unidades/remolques/ver/?id=${remolque.id}`)}
                                    >
                                        Ver más
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => router.push(`/pages/unidades/remolques/mantenimiento/${remolque.id}`)}
                                    >
                                        Mto.
                                    </button>
                                </td>
                            </tr>
                        ))}
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

export default RemolquesPanel;