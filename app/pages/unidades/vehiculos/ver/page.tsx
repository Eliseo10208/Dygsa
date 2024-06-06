'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface Camion {
  id: string;
  nombre_transportista: string;
  nro_partida_registral: string;
  placa_rodaje: string;
  clase_vehiculo: string;
  año_fabricacion: string;
  serie_chasis: string;
  modelo: string;
  nro_asientos: string;
  configuracion: string;
  carroceria: string;
  nro_ejes: string;
  capacidad_m3: string;
  capacidad_tn: string;
  pdf_tarjeta_propiedad: string;
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
  folder: string;
}

const DetallesCamion = ({ id }: { id: string }) => {
  const [camion, setCamion] = useState<Camion | null>(null);
  const router = useRouter();
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
        año_fabricacion: '2010',
        serie_chasis: 'XYZ123',
        modelo: 'Modelo A',
        nro_asientos: '2',
        configuracion: 'Configuración A',
        carroceria: 'Carrocería A',
        nro_ejes: '2',
        capacidad_m3: '10',
        capacidad_tn: '20',
        pdf_tarjeta_propiedad: '',
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
        folder: 'folder_a'
      });
    };

    fetchCamion();
  }, [id]);

  if (!camion) return <div>Loading...</div>;

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>Regresar</button>
      <div className="panel-header">
        <div className="title">
          Detalles del vehiculo {camion.placa_rodaje}
          <p>Administración de transporte de carga</p>
        </div>
        <div className="buttons">
          <div className="column"></div>
          <div className="column">
            {/* Aquí se validan los permisos, debe ajustarse según la implementación */}
            <button onClick={() => router.push('/pages/unidades/vehiculos/edit')} className="btn btn-orange2" >Editar vehículo</button>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: '35px' }}>
        <div className="col-md-6">
          <h6>Habilitación Vehicular</h6>
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Razón social de transportista</div></div>
                <div className="value">{camion.nombre_transportista}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Nº de partida registral</div></div>
                <div className="value">{camion.nro_partida_registral}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Placa rodaje</div></div>
                <div className="value">{camion.placa_rodaje}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Clase de vehículo</div></div>
                <div className="value">{camion.clase_vehiculo}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Año fabricación</div></div>
                <div className="value">{camion.año_fabricacion}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Serie chasis</div></div>
                <div className="value">{camion.serie_chasis}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Modelo</div></div>
                <div className="value">{camion.modelo}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Nº de asientos</div></div>
                <div className="value">{camion.nro_asientos}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Configuración</div></div>
                <div className="value">{camion.configuracion}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Carroceria</div></div>
                <div className="value">{camion.carroceria}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Nº ejes</div></div>
                <div className="value">{camion.nro_ejes}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Capacidad M3</div></div>
                <div className="value">{camion.capacidad_m3}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Capacidad Tn</div></div>
                <div className="value">{camion.capacidad_tn}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Tarjeta de circulación</div></div>
                <div className="value">
                  {camion.pdf_tarjeta_propiedad && (
                    <a download="tarjeta_de_circulacion" href={`/path/to/${camion.folder}/tarjeta_de_circulacion.pdf`}>Descargar</a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <h6>Poliza de seguro</h6>
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Compañia</div></div>
                <div className="value">{camion.seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de pago poliza</div></div>
                <div className="value">{camion.fecha_pago_seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento</div></div>
                <div className="value">{camion.fecha_seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Poliza de seguro</div></div>
                <div className="value">
                  {camion.pdf_poliza_seguro && (
                    <a download="poliza_seguro" href={`/path/to/${camion.folder}/poliza_seguro.pdf`}>Descargar</a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Ficha de pago</div></div>
                <div className="value">
                  {camion.pdf_seguro_pago && (
                    <a download="pago_poliza_seguro" href={`/path/to/${camion.folder}/pago_poliza_seguro.pdf`}>Descargar</a>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="group_separate"></div>
          <h6>Certificado de condiciones fisomecánicas</h6>
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Fecha de emisión</div></div>
                <div className="value">{camion.fecha_cond_diso_emi}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento</div></div>
                <div className="value">{camion.fecha_cond_diso_ven}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Ficha de pago</div></div>
                <div className="value">
                  {camion.pdf_cert_fisomeca && (
                    <a download="certificado_condiciones_fisomecanicas" href={`/path/to/${camion.folder}/certificado_condiciones_fisomecanicas.pdf`}>Descargar</a>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="group_separate"></div>
          <h6>Certificado de humos fisomecánicas</h6>
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Fecha de emisión</div></div>
                <div className="value">{camion.fecha_humo_diso_emi}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento</div></div>
                <div className="value">{camion.fecha_humo_diso_ven}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Ficha de pago</div></div>
                <div className="value">
                  {camion.pdf_cert_humofisomeca && (
                    <a download="certificado_humos_fisomecanicas" href={`/path/to/${camion.folder}/certificado_humos_fisomecanicas.pdf`}>Descargar</a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesCamion;
