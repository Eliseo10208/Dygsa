"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";

type Vehiculo = {
    id:string;
    nombre_transportista: string;
    placa_rodaje: string;
    clase_vehiculo: string;
    nro_ejes: string;
    año_fabricacion: string;
    serie_chasis: string;
};

const VehiculosPanel: React.FC = () => {
   
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [data, setData] = useState<Vehiculo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/auth/camiones');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, []);
    const filteredData = useMemo(
        () =>
            data.filter((vehiculo) =>
                Object.values(vehiculo).some((value) =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Vehiculo>[] = useMemo(
        () => [
            { Header: "Placa", accessor: "placa_rodaje" },
            { Header: "Clase de vehículo", accessor: "clase_vehiculo" },
            { Header: "Config.", accessor: "nro_ejes" },
            { Header: "Cap. M3", accessor: "año_fabricacion" },
            { Header: "Cap. Tn", accessor: "serie_chasis" },
            {
                Header: "Editar",
                id: "editar",
                Cell: ({ row }: { row: { original: Vehiculo } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => router.push('/pages/vehichulos/edit')}
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
                        onClick={() => router.push('/pages/vehichulos/ver')}
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
                        onClick={() => router.push('/pages/vehichulos/mantenimiento')}
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

   
    const tableInstance = useTable<Vehiculo>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vehículos");
        XLSX.writeFile(wb, "vehiculos.xlsx");
    };

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
                                onClick={() => router.push('/pages/unidades/vehiculos/crear')}
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
                                    <td>{vehiculo.placa_rodaje}</td>
                                    <td>{vehiculo.clase_vehiculo}</td>
                                    <td>{vehiculo.nro_ejes}</td>
                                  
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => router.push(`/pages/unidades/vehiculos/edit?id=${vehiculo.id}`)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => router.push('/pages/unidades/vehiculos/ver')}>
                                            Ver más
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => router.push('/pages/unidades/vehiculos/mantenimiento')}>
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
};

export default VehiculosPanel;
