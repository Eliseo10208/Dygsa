

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
interface Cliente {
    id: string;
    nombre: string;
}

interface Conductor {
    id: string;
    nombre: string;
}

interface Vehiculo {
    id: string;
    placa: string;
}

interface Ruta {
    id: string;
    origen: string;
    destino: string;
}

interface OrdenCarga {
    id: string;
    nro_manifiesto: string;
    cliente: string;
    tn: number;
    m3: number;
    bc: number;
    servicio: string;
    conductor: string;
    conductor2: string;
    vehiculo: string;
    ruta: string;
    ida_costo_eje: number;
    vuelta_costo_eje: number;
    fecha_programacion: string;
    fecha_presentacion: string;
    hora_presentacion: string;
    lugar_carga: string;
    combustible: string;
    carga: string;
    observacion: string;
}

const EditarOrdenCarga = ({ id }: { id: string }) => {
    const [orden, setOrden] = useState<OrdenCarga | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const router = useRouter();
    useEffect(() => {
        const fetchOrden = async () => {
            // Simula la obtención de datos de la orden
            // const response = await axios.get(`/api/ordencarga/${id}`);
            // setOrden(response.data);
            setOrden({
                id: "1",
                nro_manifiesto: "1234",
                cliente: "1",
                tn: 10,
                m3: 20,
                bc: 5,
                servicio: "local",
                conductor: "1",
                conductor2: "2",
                vehiculo: "1",
                ruta: "1",
                ida_costo_eje: 100,
                vuelta_costo_eje: 100,
                fecha_programacion: "2023-01-01",
                fecha_presentacion: "2023-01-02",
                hora_presentacion: "08:00",
                lugar_carga: "Almacén A",
                combustible: "Diesel",
                carga: "Carga A",
                observacion: "Sin observaciones",
            });
        };

        const fetchClientes = async () => {
            // Simula la obtención de datos de los clientes
            // const response = await axios.get('/api/clientes');
            // setClientes(response.data);
            setClientes([
                { id: "1", nombre: "Cliente A" },
                { id: "2", nombre: "Cliente B" },
            ]);
        };

        const fetchConductores = async () => {
            // Simula la obtención de datos de los conductores
            // const response = await axios.get('/api/conductores');
            // setConductores(response.data);
            setConductores([
                { id: "1", nombre: "Conductor A" },
                { id: "2", nombre: "Conductor B" },
            ]);
        };

        const fetchVehiculos = async () => {
            // Simula la obtención de datos de los vehículos
            // const response = await axios.get('/api/vehiculos');
            // setVehiculos(response.data);
            setVehiculos([
                { id: "1", placa: "ABC-123" },
                { id: "2", placa: "DEF-456" },
            ]);
        };

        const fetchRutas = async () => {
            // Simula la obtención de datos de las rutas
            // const response = await axios.get('/api/rutas');
            // setRutas(response.data);
            setRutas([
                { id: "1", origen: "Ciudad A", destino: "Ciudad B" },
                { id: "2", origen: "Ciudad C", destino: "Ciudad D" },
            ]);
        };

        fetchOrden();
        fetchClientes();
        fetchConductores();
        fetchVehiculos();
        fetchRutas();
    }, [id]);

    if (!orden) return <div>Loading...</div>;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // Simula el envío del formulario
        // await axios.post('/api/ordencarga/editar', formData);
        console.log("Form submitted", formData);
    };

    return (
        <div className="panel">
            <button
                className="back_btn"
                onClick={() => router.push("/pages/viajes")}
            >
                Regresar
            </button>
            <div className="panel-header">
                <div className="title">
                    Editar una orden de carga
                    <p>Administración de transporte de carga</p>
                </div>
            </div>
            <form className="form_s editar_ordencarga" onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={orden.id} />
                <div className="row">
                    <div className="col-md-6">
                        <div className="group">
                            <div className="label">Nº manifiesto</div>
                            <input
                                name="nro_manifiesto"
                                type="text"
                                className="form-control"
                                defaultValue={orden.nro_manifiesto}
                            />
                        </div>
                        <div className="group">
                            <div className="label">Cliente (*)</div>
                            <select
                                name="cliente"
                                className="form-control"
                                defaultValue={orden.cliente}
                            >
                                <option disabled>
                                    --- Selecciona un cliente ---
                                </option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="label">Tn</div>
                            <input
                                name="tn"
                                type="number"
                                className="form-control"
                                defaultValue={orden.tn}
                            />
                        </div>
                        <div className="group">
                            <div className="label">M3</div>
                            <input
                                name="m3"
                                type="number"
                                className="form-control"
                                defaultValue={orden.m3}
                            />
                        </div>
                        <div className="group">
                            <div className="label">B/C</div>
                            <input
                                name="bc"
                                type="number"
                                className="form-control"
                                defaultValue={orden.bc}
                            />
                        </div>
                        <h5>Datos Importantes</h5>
                        <div className="group">
                            <div className="label">Tipo de servicio</div>
                            <select
                                name="servicio"
                                className="form-control"
                                defaultValue={orden.servicio}
                            >
                                <option disabled>
                                    --- Selecciona un servicio ---
                                </option>
                                <option value="local">Local</option>
                                <option value="transferencia">
                                    Transferencia
                                </option>
                                <option value="nacional">Nacional</option>
                            </select>
                        </div>
                        <div className="group">
                            <div className="label">Conductor (*)</div>
                            <select
                                name="conductor"
                                className="form-control"
                                defaultValue={orden.conductor}
                            >
                                <option disabled>
                                    --- Selecciona un conductor ---
                                </option>
                                {conductores.map((conductor) => (
                                    <option
                                        key={conductor.id}
                                        value={conductor.id}
                                    >
                                        {conductor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="label">Segundo conductor</div>
                            <select
                                name="segundo_conductor"
                                className="form-control"
                                defaultValue={orden.conductor2}
                            >
                                <option disabled>
                                    --- Selecciona un conductor ---
                                </option>
                                {conductores.map((conductor) => (
                                    <option
                                        key={conductor.id}
                                        value={conductor.id}
                                    >
                                        {conductor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="label">Vehículo (*)</div>
                            <select
                                name="camion"
                                className="form-control"
                                defaultValue={orden.vehiculo}
                            >
                                <option disabled>
                                    --- Selecciona un camión ---
                                </option>
                                {vehiculos.map((vehiculo) => (
                                    <option
                                        key={vehiculo.id}
                                        value={vehiculo.id}
                                    >
                                        {vehiculo.placa}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="label">Ruta (*)</div>
                            <select
                                name="ruta"
                                className="form-control"
                                defaultValue={orden.ruta}
                            >
                                <option disabled>
                                    --- Selecciona una ruta ---
                                </option>
                                {rutas.map((ruta) => (
                                    <option key={ruta.id} value={ruta.id}>
                                        {ruta.origen} - {ruta.destino}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h5>Ruta ida</h5>
                        <div className="group">
                            <div className="label">Costo por eje (*)</div>
                            <input
                                name="ida_costo_eje"
                                type="number"
                                step="0.01"
                                className="form-control"
                                defaultValue={orden.ida_costo_eje}
                                required
                            />
                        </div>
                        <h5>Ruta vuelta</h5>
                        <div className="group">
                            <div className="label">Costo por eje (*)</div>
                            <input
                                name="vuelta_costo_eje"
                                type="number"
                                step="0.01"
                                className="form-control"
                                defaultValue={orden.vuelta_costo_eje}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="group">
                            <div className="label">Fecha programación (*)</div>
                            <input
                                name="fecha_programacion"
                                type="date"
                                className="form-control"
                                defaultValue={orden.fecha_programacion}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Fecha presentación (*)</div>
                            <input
                                name="fecha_presentacion"
                                type="date"
                                className="form-control"
                                defaultValue={orden.fecha_presentacion}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Hora presentación (*)</div>
                            <input
                                name="hora_presentacion"
                                type="time"
                                className="form-control"
                                defaultValue={orden.hora_presentacion}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Lugar de carga (*)</div>
                            <input
                                name="lugar_carga"
                                type="text"
                                className="form-control"
                                defaultValue={orden.lugar_carga}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Combustible (*)</div>
                            <input
                                name="combustible"
                                type="text"
                                className="form-control"
                                defaultValue={orden.combustible}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Carga (*)</div>
                            <input
                                name="carga"
                                type="text"
                                className="form-control"
                                defaultValue={orden.carga}
                                required
                            />
                        </div>
                        <div className="group">
                            <div className="label">Observación</div>
                            <textarea
                                name="observacion"
                                className="form-control"
                                rows={4}
                                defaultValue={orden.observacion}
                            ></textarea>
                        </div>
                        <div className="submit">
                            <button type="submit" className="btn btn-success">
                                Guardar datos
                            </button>
                        </div>
                        <div className="upload-data"></div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditarOrdenCarga;
