"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";

type Factura = {
    id: string;
    nro_factura: string;
    monto: number;
    monto_iva: number;
    monto_retencion: number;
    total: number;
};

const FacturasPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const data: Factura[] = useMemo(
        () => [
            {
                id: "1",
                nro_factura: "F001",
                monto: 1000,
                monto_iva: 160,
                monto_retencion: 40,
                total: 1120,
            },
            // Agrega más datos según sea necesario
        ],
        []
    );

    const filteredData = useMemo(
        () =>
            data.filter((factura) =>
                Object.values(factura).some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Factura>[] = useMemo(
        () => [
            { Header: "", accessor: "id", Cell: () => null },
            { Header: "Nº Factura", accessor: "nro_factura" },
            {
                Header: "Monto",
                accessor: "monto",
                Cell: ({ value }) => `MXN ${value.toFixed(2)}`,
            },
            {
                Header: "IVA (16%)",
                accessor: "monto_iva",
                Cell: ({ value }) => `MXN ${value.toFixed(2)}`,
            },
            {
                Header: "Retención (4%)",
                accessor: "monto_retencion",
                Cell: ({ value }) => `MXN ${value.toFixed(2)}`,
            },
            {
                Header: "Total",
                accessor: "total",
                Cell: ({ value }) => `MXN ${value.toFixed(2)}`,
            },
            {
                Header: "Edit.",
                id: "edit",
                Cell: ({ row }: { row: { original: Factura } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() =>
                            router.push(
                                `/pages/facturas/editar/${row.original.id}`
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
                Cell: ({ row }: { row: { original: Factura } }) => (
                    <a
                        className="table_buttons red"
                        download="factura"
                        href={`/facturas/${row.original.id}/descargar`}
                    >
                        Descargar
                    </a>
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

    const tableInstance = useTable<Factura>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Facturas");
        XLSX.writeFile(wb, "facturas.xlsx");
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
                        Lista de facturas
                        <p>Administración de transporte de carga</p>
                    </div>
                    <div className="buttons">
                        <div className="column"></div>
                        <div className="column">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    router.push("/pages/viajes/facturas/crear")
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
                        {currentData.map((factura, index) => (
                            <tr key={index}>
                                <td className="dtr-control"></td>
                                <td>{factura.nro_factura}</td>
                                <td>{`MXN ${factura.monto.toFixed(2)}`}</td>
                                <td>{`MXN ${factura.monto_iva.toFixed(2)}`}</td>
                                <td>{`MXN ${factura.monto_retencion.toFixed(
                                    2
                                )}`}</td>
                                <td>{`MXN ${factura.total.toFixed(2)}`}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                            router.push(
                                                "/pages/viajes/facturas/editar"
                                            )
                                        }
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td>
                                    <a
                                        className="btn btn-success"
                                        download="factura"
                                        href={`/facturas/${factura.id}/descargar`}
                                    >
                                        Descargar
                                    </a>
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

export default FacturasPanel;
