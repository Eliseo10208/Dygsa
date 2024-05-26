
'use client'

import React, { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import * as XLSX from 'xlsx';
import '@/app/assets/css/Styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@/app/assets/css/checkbox.css'
type Cliente = {
    nombre: string;
    direccion: string;
    distrito: string;
    provincia: string;
    telefono: string;
};

const ClientesPanel: React.FC = () => {
    const data: Cliente[] = useMemo(
        () => [
            { nombre: 'Cliente 1', direccion: 'Dirección 1', distrito: 'Distrito 1', provincia: 'Provincia 1', telefono: '123456789' },
            { nombre: 'Cliente 2', direccion: 'Dirección 2', distrito: 'Distrito 2', provincia: 'Provincia 2', telefono: '987654321' },
            // Agrega más datos según sea necesario
        ],
        []
    );

    const columns: Column<Cliente>[] = useMemo(
        () => [
            { Header: 'Nombre', accessor: 'nombre' },
            { Header: 'Dirección', accessor: 'direccion' },
            { Header: 'Distrito', accessor: 'distrito' },
            { Header: 'Provincia', accessor: 'provincia' },
            { Header: 'Teléfono', accessor: 'telefono' },
            {
                Header: 'Modificar',
                id: 'modificar',
                Cell: ({ row }: { row: { original: Cliente } }) => (
                    <button
                        className="table_buttons orange"
                        onClick={() => handleEdit(row.original)}
                    >
                        <i className="fas fa-edit"></i> Modificar
                    </button>
                ),
            },
        ],
        []
    );

    const handleEdit = (cliente: Cliente) => {
        // Implementar la lógica de edición
        console.log('Editando:', cliente);
    };

    const tableInstance = useTable<Cliente>({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    const exportTableToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        XLSX.writeFile(wb, 'clientes.xlsx');
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <div className="title">
                    Lista de clientes
                    <p>Administración de transporte de carga</p>
                </div>
                <div className="buttons">
                    <div className="column">
                        <button className="btn btn-green2" onClick={exportTableToExcel}>Descargar Excel</button>
                    </div>
                    <div className="column">
                        <button className="btn btn-primary" onClick={() => console.log('Crear nuevo')}>Crear nuevo</button>
                    </div>
                </div>
            </div>

            <table {...getTableProps()} className="display nowrap" style={{ width: '100%' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesPanel;
