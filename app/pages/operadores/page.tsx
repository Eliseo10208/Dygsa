"use client";

import React, { useMemo, useState, ChangeEvent } from "react";
import { useTable, Column } from "react-table";
import * as XLSX from "xlsx";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
type Operador = {
    id: string;
    documento: string;
    nombre: string;
    categoria: string;
    celular: string;
    licencia: string;
    fecha_vencimiento: string;
    tipo_licencia: string;
    fecha_venc_exmedico: string;
    file_licencia: string;
    file_examen_medico: string;
};

const OperadoresPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [data, setData] = useState<Operador[]>([]);
    
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('/api/auth/empleados');
              setData(response.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, []);

    const filteredData = useMemo(
        () =>
            data.filter((operador) =>
                Object.values(operador).some((value) =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ),
        [data, searchTerm]
    );

    const columns: Column<Operador>[] = useMemo(
        () => [
            { Header: "", accessor: "id", Cell: () => null },
            { Header: "id", accessor: "documento" },
            { Header: "Nombre", accessor: "nombre" },
            { Header: "Categoría", accessor: "categoria" },
            { Header: "Celular", accessor: "celular" },
            { Header: "Licencia", accessor: "tipo_licencia" },
            { Header: "Ex. médico", accessor: "fecha_venc_exmedico" },
            {
                Header: "Editar",
                id: "editar",
                Cell: ({ row }: { row: { original: Operador } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => router.push(`/pages/operadores/editar/${row.original.id}`)}
                    >
                        <i className="fas fa-edit"></i> Editar
                    </button>
                ),
            },
            {
                Header: "Ver más",
                id: "verMas",
                Cell: ({ row }: { row: { original: Operador } }) => (
                    <button
                        className="table_buttons blue"
                        onClick={() => router.push(`/pages/operadores/ver/${row.original.id}`)}
                    >
                        <i className="fas fa-eye"></i> Ver más
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

    const tableInstance = useTable<Operador>({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Operadores");
        XLSX.writeFile(wb, "operadores.xlsx");
    };

    return (
        <>
            <div className="panel">
                <div className="panel-header">
                    <div className="title">
                        Lista de operadores
                        <p>Administración de operadores</p>
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
                                onClick={() => router.push('/pages/operadores/crear')}
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
                        {currentData.map((operador, index) => (
                            <tr key={index}>
                                <td className="dtr-control"></td>
                                <td>{operador.id}</td>
                                <td>{operador.nombre}</td>
                                <td>{operador.categoria}</td>
                                <td>{operador.celular}</td>
                                <td>{operador.tipo_licencia}</td>
                                <td>{operador.fecha_venc_exmedico}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() =>  router.push(`/pages/operadores/editar?id=${operador.id}`)}
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => router.push(`/pages/operadores/ver?id=${operador.id}`)}
                                    >
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

export default OperadoresPanel;
