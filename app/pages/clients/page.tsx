"use client";

import React, { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import CrearCliente from "./newClient";
import EditClient from "./editClient"; // Ajusta la ruta según sea necesario

type Cliente = {
    id: number;
    nombre: string;
    direccion: string;
    distrito: string;
    provincia: string;
    telefono: string;
};

const ClientesPanel: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get("/api/auth/clients");
                setClientes(response.data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
            }
        };

        fetchClientes();
    }, []);

    const filteredData = useMemo(
        () =>
            clientes.filter((cliente) =>
                Object.values(cliente).some((value) =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [clientes, searchTerm]
    );

    const columns: Column<Cliente>[] = useMemo(
        () => [
            { Header: "Nombre", accessor: "nombre" },
            { Header: "Dirección", accessor: "direccion" },
            { Header: "Distrito", accessor: "distrito" },
            { Header: "Provincia", accessor: "provincia" },
            { Header: "Teléfono", accessor: "telefono" },
            {
                Header: "Modificar",
                id: "modificar",
                Cell: ({ row }: { row: { original: Cliente } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => setActiveComponent("newClient")}
                    >
                        <i className="fas fa-edit"></i> Modificar
                    </button>
                ),
            },
        ],
        [router]
    );

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const renderContent = () => {
        switch (activeComponent) {
            case "newClient":
                return <CrearCliente onBack={() => setActiveComponent("")} />;
            case "editClient":
                return <EditClient onBack={() => setActiveComponent("")} />;
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
                                                setActiveComponent("newClient")
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
                            <div className="col-md-6">
                                <label>
                                    Mostrar
                                    <select
                                        name="table_id3_length"
                                        aria-controls="table_id3"
                                        className="form-select d-inline-block w-auto ms-2"
                                        value={itemsPerPage}
                                        onChange={(e) =>
                                            setItemsPerPage(
                                                parseInt(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    >
                                        <option value="10">
                                            10
                                        </option>
                                        <option value="25">
                                            25
                                        </option>
                                        <option value="50">
                                            50
                                        </option>
                                        <option value="100">
                                            100
                                        </option>
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
                                    ID
                                </th>
                                <th>Nombre</th>
                                <th>Direccion</th>
                                <th>Distrito</th>
                                <th>Provincia</th>

                                            <th>Telefono</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((cliente, index) => (
                                            <tr key={index}>
                                                <td className="dtr-control"></td>
                                                <td>{index + 1}</td>{" "}
                                                {/* Puedes usar el índice del map para un número de fila */}
                                                <td>{cliente.nombre}</td>
                                                <td>{cliente.direccion}</td>
                                                <td>{cliente.distrito}</td>
                                                <td>{cliente.provincia}</td>
                                                <td>{cliente.telefono}</td>
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

    const tableInstance = useTable<Cliente>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");
        XLSX.writeFile(wb, "clientes.xlsx");
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

    return <div className="panel">{renderContent()}</div>;
};

export default ClientesPanel;
