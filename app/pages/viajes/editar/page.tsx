'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter, useSearchParams } from "next/navigation";

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

const EditarOrdenCarga: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [remolques, setRemolques] = useState<Remolque[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
  
    const router = useRouter();
    const searchParams = useSearchParams();
    const ordenId = searchParams.get('id');

    useEffect(() => {
        axios.get("/api/auth/clients").then(response => setClientes(response.data));
        axios.get("/api/auth/empleados").then(response => setEmpleados(response.data));
        axios.get("/api/auth/camiones").then(response => setVehiculos(response.data));
        axios.get("/api/auth/remolques").then(response => setRemolques(response.data));

        if (ordenId && initialLoad) {
            const fetchOrdenCarga = async () => {
                try {
                    const response = await axios.get(`/api/auth/crear-orden-carga/${ordenId}`);
                    const ordenData = response.data;
                    setFormData(ordenData);
                    setInitialLoad(false);
                } catch (error) {
                    console.error('Error fetching order data:', error);
                }
            };
            fetchOrdenCarga();
        }
    }, [ordenId, initialLoad]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validación de campos
        if (
            !formData.servicio ||
            !formData.empleado ||
            !formData.cliente ||
            !formData.camion ||
            !formData.fecha_programacion ||
            !formData.fecha_presentacion ||
            !formData.carga
        ) {
            console.error("Todos los campos obligatorios deben estar llenos");
            return;
        }

        try {
            const response = await axios.put(`/api/auth/crear-orden-carga/${ordenId}`, formData);
            if (response.data.status === "success") {
                router.push('/pages/viajes');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (initialLoad) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="panel">
            <button className="back_btn btn btn-secondary" onClick={() => router.push('/pages/viajes')}>
                Regresar
            </button>
            <div className="panel-header">
                <div className="title">
                    Editar orden de carga
                    <p>Administración de transporte de carga</p>
                </div>
            </div>
            <form className="form_s editar_ordencarga" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col-md-6">
                        <div className="group">
                            <label className="form-label">Nº Viaje</label>
                            <input name="nro_manifiesto" type="text" className="form-control" value={formData.nro_manifiesto || ''} onChange={handleChange} />
                        </div>
                        <div className="group">
                            <label className="form-label">Cliente</label>
                            <select name="cliente" className="form-control" value={formData.cliente || ''} onChange={handleChange}>
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
                            <input name="tn" type="number" className="form-control" value={formData.tn || ''} onChange={handleChange} />
                        </div>
                       
                        <h5>Datos Importantes</h5>
                        <div className="group">
                            <label className="form-label">Tipo de servicio</label>
                            <select name="servicio" className="form-control" value={formData.servicio || ''} onChange={handleChange}>
                                <option selected disabled>--- Selecciona un servicio ---</option>
                                <option value="local">Local</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="foranea">Foranea</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="form-label">Empleado (*)</label>
                            <select name="empleado" className="form-control" value={formData.empleado || ''} onChange={handleChange}>
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
                            <select name="camion" className="form-control" value={formData.camion || ''} onChange={handleChange}>
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
                            <select name="remolque" className="form-control" value={formData.remolque || ''} onChange={handleChange}>
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
                            <input name="fecha_programacion" type="date" className="form-control" value={formData.fecha_programacion || ''} onChange={handleChange} required />
                        </div>
                        <div className="group">
                            <label className="form-label">Fecha Descarga (*)</label>
                            <input name="fecha_presentacion" type="date" className="form-control" value={formData.fecha_presentacion || ''} onChange={handleChange} required />
                        </div>
                        <div className="group">
                            <label className="form-label">Hora presentación (Opcional)</label>
                            <input name="hora_presentacion" type="time" className="form-control" value={formData.hora_presentacion || ''} onChange={handleChange} />
                        </div>
                        <div className="group">
                            <label className="form-label">Lugar de carga (Opcional)</label>
                            <input name="lugar_carga" type="text" className="form-control" value={formData.lugar_carga || ''} onChange={handleChange} />
                        </div>
                      
                        <div className="group">
                            <label className="form-label">Carga (*)</label>
                            <input name="carga" type="text" className="form-control" value={formData.carga || ''} onChange={handleChange} required />
                        </div>
                        <div className="group">
                            <label className="form-label">Observación</label>
                            <textarea name="observacion" className="form-control" rows={4} value={formData.observacion || ''} onChange={handleChange}></textarea>
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

export default EditarOrdenCarga;
