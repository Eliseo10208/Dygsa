
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Camion {
  id: string;
  nombre_transportista: string;
  nro_partida_registral: string;
  placa_rodaje: string;
  clase_vehiculo: string;
  nro_ejes: string;
  año_fabricacion: string;
  serie_chasis: string;
  modelo: string;
  nro_asientos: string;
  configuracion: string;
  carroceria: string;
  capacidad_m3: string;
  capacidad_tn: string;
  seguro: string;
  fecha_pago_seguro: string;
  fecha_seguro: string;
  pdf_poliza_seguro: string;
  pdf_seguro_pago: string;
  fecha_cond_diso_emi: string;
  fecha_cond_diso_ven: string;
  pdf_cert_fisomeca: string;
  fecha_humo_diso_emi: string;
  fecha_humo_diso_ven: string;
  pdf_cert_humofisomeca: string;
  pdf_tarjeta_propiedad: string;
}

const EditarCamion = ({ id }: { id: string }) => {
  const [camion, setCamion] = useState<Camion | null>(null);

  useEffect(() => {
    const fetchCamion = async () => {
      // Simula la obtención de datos del camión
      // const response = await axios.get(`/api/camion/${id}`);
      // setCamion(response.data);
      setCamion({
        id: '1',
        nombre_transportista: 'Transportista A',
        nro_partida_registral: '123456',
        placa_rodaje: 'ABC-123',
        clase_vehiculo: 'Camión',
        nro_ejes: '2',
        año_fabricacion: '2010',
        serie_chasis: 'XYZ123',
        modelo: 'Modelo A',
        nro_asientos: '2',
        configuracion: 'Configuración A',
        carroceria: 'Carrocería A',
        capacidad_m3: '10',
        capacidad_tn: '20',
        seguro: 'Seguros ABC',
        fecha_pago_seguro: '2023-01-01',
        fecha_seguro: '2024-01-01',
        pdf_poliza_seguro: '',
        pdf_seguro_pago: '',
        fecha_cond_diso_emi: '2023-01-01',
        fecha_cond_diso_ven: '2024-01-01',
        pdf_cert_fisomeca: '',
        fecha_humo_diso_emi: '2023-01-01',
        fecha_humo_diso_ven: '2024-01-01',
        pdf_cert_humofisomeca: '',
        pdf_tarjeta_propiedad: ''
      });
    };

    fetchCamion();
  }, [id]);

  if (!camion) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Simula el envío del formulario
    // await axios.post('/api/camion/editar', formData);
    console.log('Form submitted', formData);
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>Regresar</button>
      <form className="form_s editar_camion" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={camion.id} />
        <div className="row">
          <div className="col-md-6">
            <h4>Habilitación Vehicular</h4>
            <div className="group">
              <div className="label">Nombre o razón social del transportista</div>
              <input name="nombre_transportista" type="text" className="form-control" defaultValue={camion.nombre_transportista} />
            </div>
            <div className="group">
              <div className="label">Nro de partida registral</div>
              <input name="nro_partida_registral" type="text" className="form-control" defaultValue={camion.nro_partida_registral} />
            </div>
            <div className="group">
              <div className="label">Placa de rodaje</div>
              <input name="placa_rodaje" type="text" className="form-control" defaultValue={camion.placa_rodaje} />
            </div>
            <div className="group">
              <div className="label">Clase de vehículo</div>
              <input name="clase_vehiculo" type="text" className="form-control" defaultValue={camion.clase_vehiculo} />
            </div>
            <div className="group">
              <div className="label">Nro ejes</div>
              <input name="nro_ejes" type="text" className="form-control" defaultValue={camion.nro_ejes} />
            </div>
            <div className="group">
              <div className="label">Año fabricación</div>
              <input name="año_fabricacion" type="text" className="form-control" defaultValue={camion.año_fabricacion} />
            </div>
            <div className="group">
              <div className="label">Número o serie del chasis</div>
              <input name="serie_chasis" type="text" className="form-control" defaultValue={camion.serie_chasis} />
            </div>
            <div className="group">
              <div className="label">Modelo</div>
              <input name="modelo" type="text" className="form-control" defaultValue={camion.modelo} />
            </div>
            <div className="group">
              <div className="label">Nro de asientos</div>
              <input name="nro_asientos" type="text" className="form-control" defaultValue={camion.nro_asientos} />
            </div>
            <div className="group">
              <div className="label">Configuración</div>
              <input name="configuracion" type="text" className="form-control" defaultValue={camion.configuracion} />
            </div>
            <div className="group">
              <div className="label">Carrocería</div>
              <input name="carroceria" type="text" className="form-control" defaultValue={camion.carroceria} />
            </div>
            <h5>Adicionales</h5>
            <div className="group">
              <div className="label">Capacidad M3</div>
              <input name="capacidad_m3" type="text" className="form-control" defaultValue={camion.capacidad_m3} />
            </div>
            <div className="group">
              <div className="label">Capacidad Tn</div>
              <input name="capacidad_tn" type="text" className="form-control" defaultValue={camion.capacidad_tn} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Poliza de seguro</h5>
            <div className="group">
              <div className="label">Compañia</div>
              <input name="seguro_compañia" type="text" className="form-control" defaultValue={camion.seguro} />
            </div>
            <div className="group">
              <div className="label">Fecha de pago poliza</div>
              <input name="fecha_pago_seguro" type="date" className="form-control" defaultValue={camion.fecha_pago_seguro} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_seguro" type="date" className="form-control" defaultValue={camion.fecha_seguro} />
            </div>
            <div className="group">
              <div className="label">Poliza de seguro</div>
              <input name="pdf_poliza_seguro" type="file" className="form-control" accept=".pdf" />
              <div className={`status ${camion.pdf_poliza_seguro ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Ficha de pago</div>
              <input name="pdf_seguro_pago" type="file" className="form-control" accept=".pdf" />
              <div className={`status ${camion.pdf_seguro_pago ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de condiciones fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_cond_diso_emi" type="date" className="form-control" defaultValue={camion.fecha_cond_diso_emi} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_cond_diso_ven" type="date" className="form-control" defaultValue={camion.fecha_cond_diso_ven} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_fisomeca" type="file" className="form-control" accept=".pdf" />
              <div className={`status ${camion.pdf_cert_fisomeca ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de humos fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_humo_diso_emi" type="date" className="form-control" defaultValue={camion.fecha_humo_diso_emi} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_humo_diso_ven" type="date" className="form-control" defaultValue={camion.fecha_humo_diso_ven} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_humofisomeca" type="file" className="form-control" accept=".pdf" />
              <div className={`status ${camion.pdf_cert_humofisomeca ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Tarjeta de circulación</div>
              <input name="pdf_tarjeta_propiedad" type="file" className="form-control" accept=".pdf" />
              <div className={`status ${camion.pdf_tarjeta_propiedad ? 'si' : 'no'}`}></div>
            </div>
            <div className="submit">
              <button type="submit" className="btn btn-success">Guardar datos</button>
            </div>
            <div className="upload-data"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarCamion;
