"use client";

import React, { useMemo, useState, ChangeEvent, useEffect } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";

type Ruta = {
    id: string;
    origen: string;
    destino: string;
    kms: number;
    nro_peajes: number;
    costo_peaje: number;
    combustible: string;
};

const RutasPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [ruta, setRuta] = useState<Ruta[]>([]);
    const data: Ruta[] = useMemo(
        () => [
            {
                id: "1",
                origen: "Ciudad A",
                destino: "Ciudad B",
                kms: 300,
                nro_peajes: 3,
                costo_peaje: 150,
                combustible: "Diesel",
            },
            // Agrega más datos según sea necesario
        ],
        []
    );
    useEffect(() => {
      const fetchClientes = async () => {
          try {
              const response = await axios.get("/api/auth/rutas");
              setRuta(response.data);
          } catch (error) {
              console.error("Error fetching clientes:", error);
          }
      };

      fetchClientes();
  }, []);

    const filteredData = useMemo(
        () =>
            ruta.filter((ruta) =>
                Object.values(ruta).some((value) =>
                  value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [ruta, searchTerm]
    );

    const columns: Column<Ruta>[] = useMemo(
        () => [
            { Header: "", accessor: "id", Cell: () => null },
            { Header: "Origen", accessor: "origen" },
            { Header: "Destino", accessor: "destino" },
            { Header: "KMS", accessor: "kms" },
            // { Header: "Nro. peajes", accessor: "nro_peajes" },
            // {
            //     Header: "Costo peaje",
            //     accessor: "costo_peaje",
            //     Cell: ({ value }) => `MXN ${value.toFixed(2)}`,
            // },
            { Header: "Combustible", accessor: "combustible" },
            {
                Header: "Modificar",
                id: "modificar",
                Cell: ({ row }: { row: { original: Ruta } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => router.push(`/pages/rutas/editar/${row.original.id}`)}
                    >
                        <i className="fas fa-edit"></i> Modificar
                    </button>
                ),
            },
            {
                Header: "Agregar peaje",
                id: "agregarPeaje",
                Cell: ({ row }: { row: { original: Ruta } }) => (
                    <button
                        className="table_buttons green"
                        onClick={() => router.push(`/pages/rutas/agregar-peaje/${row.original.id}`)}
                    >
                        <i className="fas fa-plus"></i> Agregar peaje
                    </button>
                ),
            },
            {
                Header: "Ver peajes",
                id: "verPeajes",
                Cell: ({ row }: { row: { original: Ruta } }) => (
                    <button
                        className="table_buttons blue"
                        onClick={() => router.push(`/pages/rutas/ver-peajes/${row.original.id}`)}
                    >
                        <i className="fas fa-eye"></i> Ver peajes
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

    const tableInstance = useTable<Ruta>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rutas");
        XLSX.writeFile(wb, "rutas.xlsx");
    };

    return (
        <>
            <div className="panel">
                <div className="panel-header">
                    <div className="title">
                        Lista de rutas
                        <p>Administración de rutas</p>
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
                                onClick={() => router.push('/pages/rutas/crear')}
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
                        {currentData.map((ruta, index) => (
                            <tr key={index}>
                                <td className="dtr-control"></td>
                                <td>{ruta.origen}</td>
                                <td>{ruta.destino}</td>
                                <td>{ruta.kms}</td>
                                {/* <td>{ruta.nro_peajes}</td> */}
                                {/* <td>{`MXN ${ruta.costo_peaje.toFixed(2)}`}</td> */}
                                <td>{ruta.combustible}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => router.push(`/pages/rutas/editar/${ruta.id}`)}
                                    >
                                        Modificar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => router.push(`/pages/rutas/agregar-peaje/${ruta.id}`)}
                                    >
                                        Agregar peaje
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => router.push(`/pages/rutas/ver-peajes/${ruta.id}`)}
                                    >
                                        Ver peajes
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

export default RutasPanel;
