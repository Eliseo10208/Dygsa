"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";

type Vehiculo = {
    placa: string;
    clase: string;
    configuracion: string;
    capM3: string;
    capTn: string;
};

const VehiculosPanel: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const data: Vehiculo[] = useMemo(
        () => [
            {
                placa: "ABC-123",
                clase: "Camión",
                configuracion: "4x2",
                capM3: "20",
                capTn: "10",
            },
            // Agrega más datos según sea necesario
        ],
        []
    );

    const filteredData = useMemo(
        () =>
            data.filter((vehiculo) =>
                Object.values(vehiculo).some((value) =>
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Vehiculo>[] = useMemo(
        () => [
            { Header: "Placa", accessor: "placa" },
            { Header: "Clase de vehículo", accessor: "clase" },
            { Header: "Config.", accessor: "configuracion" },
            { Header: "Cap. M3", accessor: "capM3" },
            { Header: "Cap. Tn", accessor: "capTn" },
            {
                Header: "Editar",
                id: "editar",
                Cell: ({ row }: { row: { original: Vehiculo } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => setActiveComponent("editVehiculo")}
                    >
                        <i className="fas fa-edit"></i> Editar
                    </button>
                ),
            },
            {
                Header: "Ver más",
                id: "verMas",
                Cell: ({ row }: { row: { original: Vehiculo } }) => (
                    <button
                        className="table_buttons blue"
                        onClick={() => setActiveComponent("viewVehiculo")}
                    >
                        <i className="fas fa-eye"></i> Ver más
                    </button>
                ),
            },
            {
                Header: "Mto.",
                id: "mantenimiento",
                Cell: ({ row }: { row: { original: Vehiculo } }) => (
                    <button
                        className="table_buttons green"
                        onClick={() => setActiveComponent("maintenanceVehiculo")}
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

    const renderContent = () => {
        switch (activeComponent) {
            case "editVehiculo":
                return; // Aquí puedes agregar el componente para editar
            case "viewVehiculo":
                return; // Aquí puedes agregar el componente para ver más detalles
            case "maintenanceVehiculo":
                return; // Aquí puedes agregar el componente para mantenimiento
            default:
                return (
                    <>
                        <div className="panel">
                            <div className="panel-header">
                                <div className="title">
                                    Lista de vehículos
                                    <p>Administración de vehículos</p>
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
                                                setActiveComponent("newVehiculo")
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
                                                Placa
                                            </th>
                                            <th style={{ width: "61px" }}>
                                                Clase de vehículo
                                            </th>
                                            <th style={{ width: "58px" }}>
                                                Config.
                                            </th>
                                            <th style={{ width: "49px" }}>
                                                Cap. M3
                                            </th>
                                            <th style={{ width: "60px" }}>
                                                Cap. Tn
                                            </th>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "26px" }}
                                            >
                                                Editar
                                            </th>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "47px" }}
                                            >
                                                Ver más
                                            </th>
                                            <th
                                                className="excel_clear"
                                                style={{ width: "45px" }}
                                            >
                                                Mto.
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((vehiculo, index) => (
                                            <tr key={index}>
                                                <td className="dtr-control"></td>
                                                <td>{vehiculo.placa}</td>
                                                <td>{vehiculo.clase}</td>
                                                <td>{vehiculo.configuracion}</td>
                                                <td>{vehiculo.capM3}</td>
                                                <td>{vehiculo.capTn}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() =>
                                                            setActiveComponent(
                                                                "editVehiculo"
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-success">
                                                        Ver más
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary">
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
                            </table>
                        </div>
                    </>
                );
        }
    };

    const tableInstance = useTable<Vehiculo>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vehículos");
        XLSX.writeFile(wb, "vehiculos.xlsx");
    };

    return <div className="panel">{renderContent()}</div>;
};

export default VehiculosPanel;
