
'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import { useRouter } from "next/navigation";

type Cliente = {
    id: number;
    nombre: string;
};

type Conductor = {
    id: number;
    nombre: string;
};

type Vehiculo = {
    id: number;
    nombre: string; // Ajustar según los datos reales
};

type Ruta = {
    id: number;
    origen: string;
    destino: string;
};

const OrdenCarga: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Reemplazar con las rutas de tus APIs
       axios.get("/api/auth/clients").then(response => setClientes(response.data));
        axios.get("/api/conductores").then(response => setConductores(response.data));
        axios.get("/api/vehiculos").then(response => setVehiculos(response.data));
        axios.get("/api/rutas").then(response => setRutas(response.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        // Validación de campos
        if (
            !values.servicio ||
            !values.conductor ||
            !values.cliente ||
            !values.camion ||
            !values.ruta
        ) {
            return;
        }

        try {
            const response = await axios.post("/api/crear-orden-carga", values);
            if (response.data.status === "success") {
                // Reemplazar pagemenu con la navegación adecuada en Next.js
                // Router.push(`/ordencarga?ver=${response.data.id}`);
            }
        } catch (error) {
            console.error(error);
        }
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
                        {/* <div className="group">
                            <label className="form-label">M3</label>
                            <input name="m3" type="number" className="form-control" />
                        </div> */}
                        {/* <div className="group">
                            <label className="form-label">B/C</label>
                            <input name="bc" type="number" className="form-control" />
                        </div> */}
                        <h5>Datos Importantes</h5>
                        <div className="group">
                            <label className="form-label">Tipo de servicio</label>
                            <select name="servicio" className="form-control">
                                <option selected disabled>--- Selecciona un servicio ---</option>
                                <option value="local">Local</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="foranea">Foranea</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="form-label">Conductor (*)</label>
                            <select name="conductor" className="form-control">
                                <option selected disabled>--- Selecciona un conductor ---</option>
                                {conductores.map((conductor) => (
                                    <option key={conductor.id} value={conductor.id}>
                                        {conductor.nombre}
                                      
                                    </option>

                                    
                                ))}
                            </select>
                        </div>
                        {/* <div className="group">
                            <label className="form-label">Segundo conductor</label>
                            <select name="segundo_conductor" className="form-control">
                                <option selected disabled>--- Selecciona un conductor ---</option>
                                {conductores.map((conductor) => (
                                    <option key={conductor.id} value={conductor.id}>
                                        {conductor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="group">
                            <label className="form-label">Tracto y Plana</label>
                            <select name="camion" className="form-control">
                                <option selected disabled>--- Selecciona un camión ---</option>
                                {vehiculos.map((vehiculo) => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="group">
                            <label className="form-label">Ruta (*)</label>
                            <select name="ruta" className="form-control">
                                <option selected disabled>--- Selecciona una ruta ---</option>
                                {rutas.map((ruta) => (
                                    <option key={ruta.id} value={ruta.id}>
                                        {ruta.origen} - {ruta.destino}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <h5>Ruta ida</h5> */}
                        {/* <div className="group">
                            <label className="form-label">Costo por eje (*)</label>
                            <input name="ida_costo_eje" type="number" step="0.01" className="form-control" required />
                        </div> */}
                        {/* <h5>Ruta vuelta</h5>
                        <div className="group">
                            <label className="form-label">Costo por eje (*)</label>
                            <input name="vuelta_costo_eje" type="number" step="0.01" className="form-control" required />
                        </div> */}
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
                            <input name="hora_presentacion" type="time" className="form-control" required />
                        </div>
                        <div className="group">
                            <label className="form-label">Lugar de carga (Opcional)</label>
                            <input name="lugar_carga" type="text" className="form-control" required />
                        </div>
                        {/* <div className="group">
                            <label className="form-label">Combustible (*)</label>
                            <input name="combustible" type="text" className="form-control" required />
                        </div> */}
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