'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";

type Cliente = {
    id: number;
    nombre: string;
};

type Empleado = {
    id: number;
    nombre: string;
};

type Vehiculo = {
    id: number;
    nombre_transportista: string; 
};

type Remolque = {
    id: number;
    nombre_transportista: string;
};

const OrdenCarga: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [remolques, setRemolques] = useState<Remolque[]>([]);
  
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/auth/clients").then(response => setClientes(response.data));
        axios.get("/api/auth/empleados").then(response => setEmpleados(response.data));
        axios.get("/api/auth/camiones").then(response => setVehiculos(response.data));
        axios.get("/api/auth/remolques").then(response => setRemolques(response.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        // Validación de campos
        if (
            !values.servicio ||
            !values.empleado ||
            !values.cliente ||
            !values.camion ||
            !values.carga
        ) {
            Swal.fire('Alerta!', 'Todos los campos obligatorios deben ser completados.', 'warning');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres guardar la nueva orden de carga?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post("/api/auth/crear-orden-carga", values);
                    if (response.data.status === "success") {
                        Swal.fire('Guardado', 'La orden de carga ha sido creada exitosamente.', 'success').then(() => {
                            router.push('/pages/viajes');
                        });
                    } else {
                        Swal.fire('Error', 'Hubo un problema al crear la orden de carga.', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Hubo un problema al crear la orden de carga. Ver consola para más detalles.', 'error');
                }
            }
        });
    };

    return (
        <div className="panel">
            <button className="back_btn btn btn-secondary" onClick={() => router.push('/pages/viajes')}>
                Regresar
            </button>
            <div className="panel-header">
                <div className="title">
                    Agregar nueva orden de carga
                    <p>Administración de transporte de carga</p>
                </div>
            </div>
            <form className="form_s crear_ordencarga" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col-md-6">
                        <div className="group">
                            <label className="form-label">Nº Viaje</label>
                            <input name="nro_manifiesto" type="text" className="form-control" />
                        </div>
                        <div className="group">
                            <label className="form-label">Cliente</label>
                            <select name="cliente" className="form-control">
                                <option selected disabled>--- Selecciona un cliente ---</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <label className="form-label">Toneladas</label>
                            <input name="tn" type="number" className="form-control" />
                        </div>
                       
                        <h5>Datos Importantes</h5>
                        <div className="group">
                            <label className="form-label">Tipo de servicio</label>
                            <select name="servicio" className="form-control">
                                <option selected disabled>--- Selecciona un servicio ---</option>
                                <option value="local">Local</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="foranea">Foránea</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="form-label">Empleado (*)</label>
                            <select name="empleado" className="form-control">
                                <option selected disabled>--- Selecciona un empleado ---</option>
                                {empleados.map((empleado) => (
                                    <option key={empleado.id} value={empleado.id}>
                                        {empleado.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                       
                        <div className="group">
                            <label className="form-label">Tracto y Plana</label>
                            <select name="camion" className="form-control">
                                <option selected disabled>--- Selecciona un camión ---</option>
                                {vehiculos.map((vehiculo) => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.nombre_transportista}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <label className="form-label">Remolque (Opcional)</label>
                            <select name="remolque" className="form-control">
                                <option selected disabled>--- Selecciona un remolque ---</option>
                                {remolques.map((remolque) => (
                                    <option key={remolque.id} value={remolque.id}>
                                        {remolque.nombre_transportista}
                                    </option>
                                ))}
                            </select>
                        </div>
                     
                    </div>
                    <div className="col-md-6">
                        <div className="group">
                            <label className="form-label">Fecha Carga (*)</label>
                            <input name="fecha_programacion" type="date" className="form-control" required />
                        </div>
                        <div className="group">
                            <label className="form-label">Fecha Descarga (*)</label>
                            <input name="fecha_presentacion" type="date" className="form-control" required />
                        </div>
                        <div className="group">
                            <label className="form-label">Hora presentación (Opcional)</label>
                            <input name="hora_presentacion" type="time" className="form-control" />
                        </div>
                        <div className="group">
                            <label className="form-label">Lugar de carga (Opcional)</label>
                            <input name="lugar_carga" type="text" className="form-control" />
                        </div>
                      
                        <div className="group">
                            <label className="form-label">Carga (*)</label>
                            <input name="carga" type="text" className="form-control" required />
                        </div>
                        <div className="group">
                            <label className="form-label">Observación</label>
                            <textarea name="observacion" className="form-control" rows={4}></textarea>
                        </div>
                        <div className="submit">
                            <button type="submit" className="btn btn-success">Guardar datos</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrdenCarga;
