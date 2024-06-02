"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import OrdenCarga from "./editar/page";
type Viaje = {
    nManifiesto: string;
    fProgram: string;
    ruta: string;
    vehiculo: string;
    conductor: string;
};

const ViajesPanel: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const data: Viaje[] = useMemo(
        () => [
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "sasa",
            },
            {
                nManifiesto: "Cliente 1",
                fProgram: "Dirección 1",
                ruta: "Distrito 1",
                vehiculo: "Provincia 1",
                conductor: "asassa",
            },
            // Agrega más datos según sea necesario
        ],
        []
    );

    const filteredData = useMemo(
        () =>
            data.filter((viaje) =>
                Object.values(viaje).some((value) =>
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Viaje>[] = useMemo(
        () => [
            { Header: "NManifiesto", accessor: "nManifiesto" },
            { Header: "FProgramn", accessor: "fProgram" },
            { Header: "Ruta", accessor: "ruta" },
            { Header: "Vehiculo", accessor: "vehiculo" },
            { Header: "Conductor", accessor: "conductor" },
            {
                Header: "Modificar",
                id: "modificar",
                Cell: ({ row }: { row: { original: Viaje } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => setActiveComponent("newClient")}
                    >
                        <i className="fas fa-edit"></i> Modificar
                    </button>
                ),
            },
        ],
        []
    );

    const handleCellDoubleClick = () => {
        console.log("Editando:");
    };

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

    const renderContent = () => {
        switch (activeComponent) {
            case "OrdenCarga":
                return <OrdenCarga/>;
            case "editClient":
                return; // <EditClient onBack={() => setActiveComponent("")} />;
            default:
                return (
                    <>
                        <div className="panel">
                            <div className="panel-header">
                                <div className="title">
                                    Lista de clientes
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
                                                setActiveComponent("OrdenCarga")
                                            }
                                        >
                                            Crear nuevo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <table
                                {...getTableProps()}
                                className="display nowrap"
                                style={{ width: "100%" }}
                            >
                                <thead>
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
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </thead>
                                <table
                                    id="table_id3"
                                    className="table table-striped table-bordered nowrap"
                                    style={{ width: "100%" }}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "0px" }}
                                            ></th>
                                            <th style={{ width: "79px" }}>
                                                Nº Manifiesto
                                            </th>
                                            <th style={{ width: "61px" }}>
                                                F. program
                                            </th>
                                            <th style={{ width: "58px" }}>
                                                Ruta
                                            </th>
                                            <th style={{ width: "49px" }}>
                                                Vehículo
                                            </th>
                                            <th style={{ width: "60px" }}>
                                                Conductor
                                            </th>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "26px" }}
                                            >
                                                Edit.
                                            </th>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "47px" }}
                                            >
                                                Facturas
                                            </th>
                                            <th
                                                className="excel_clear d-none"
                                                style={{ width: "45px" }}
                                            >
                                                Ver más
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((viaje, index) => (
                                            <tr key={index}>
                                                <td className="dtr-control"></td>
                                                <td>{viaje.nManifiesto}</td>
                                                <td>{viaje.fProgram}</td>
                                                <td>{viaje.ruta}</td>
                                                <td>{viaje.vehiculo}</td>
                                                <td>{viaje.conductor}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() =>
                                                            setActiveComponent(
                                                                "editClient"
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-success">
                                                        Facturas
                                                    </button>
                                                </td>
                                                <td className="d-none">
                                                    <button className="btn btn-primary">
                                                        Ver más
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
                                        onClick={() =>
                                            handlePageChange("previous")
                                        }
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
                                            Pagina {currentPage}
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
                            </table>
                        </div>
                    </>
                );
        }
    };

    const tableInstance = useTable<Viaje>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Viajes");
        XLSX.writeFile(wb, "viajes.xlsx");
    };

    return <div className="panel">{renderContent()}</div>;
};

export default ViajesPanel;
