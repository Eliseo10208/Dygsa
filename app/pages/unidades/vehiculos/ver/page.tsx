'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface Camion {
  id: number;
  nombre_transportista: string;
  placa_rodaje: string;
  clase_vehiculo: string;
  nro_ejes: string;
  año_fabricacion: string;
  serie_chasis: string;
  seguro_compañia: string;
  fecha_pago_seguro: string;
  fecha_seguro: string;
  ruta_pdf_poliza_seguro: string;
  ruta_pdf_seguro_pago: string;
  fecha_cond_diso_emi: string;
  fecha_cond_diso_ven: string;
  ruta_pdf_cert_fisomeca: string;
  fecha_humo_diso_emi: string;
  fecha_humo_diso_ven: string;
  ruta_pdf_cert_humofisomeca: string;
  ruta_pdf_tarjeta_propiedad: string;
}


const DetallesCamion :React.FC = () => {
  const [camion, setCamion] = useState<Camion | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const camionId = searchParams.get('id');

  useEffect(() => {
    const fetchCamion = async () => {
      try {
        const response = await axios.get(`/api/auth/camiones/${camionId}`);
        setCamion(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching camion:', error);
      }
    };

    fetchCamion();
  }, [camionId]);

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
            <button onClick={() => router.push(`/pages/unidades/vehiculos/edit?id=${camion.id}`)} className="btn btn-orange2">Editar vehículo</button>
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
                <div className="name"><div className="ct">Placa de tracto</div></div>
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
                <div className="name"><div className="ct">Fecha de pago poliza</div></div>
                <div className="value">{camion.fecha_pago_seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Nº ejes</div></div>
                <div className="value">{camion.nro_ejes}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Tarjeta de circulación</div></div>
                <div className="value">
                  {camion.ruta_pdf_tarjeta_propiedad ? (
                    <a
                      download="tarjeta_de_circulacion"
                      href={camion.ruta_pdf_tarjeta_propiedad}
                    >
                      Descargar
                    </a>
                  ) : 'No disponible'}
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
                <div className="value">{camion.seguro_compañia}</div>
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
                  {camion.ruta_pdf_poliza_seguro ? (
                    <a download="poliza_seguro" href={camion.ruta_pdf_poliza_seguro}>Descargar</a>
                  ) : 'No disponible'}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Ficha de pago</div></div>
                <div className="value">
                  {camion.ruta_pdf_seguro_pago ? (
                    <a download="pago_poliza_seguro" href={camion.ruta_pdf_seguro_pago}>Descargar</a>
                  ) : 'No disponible'}
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
                  {camion.ruta_pdf_cert_fisomeca ? (
                    <a download="certificado_condiciones_fisomecanicas" href={camion.ruta_pdf_cert_fisomeca}>Descargar</a>
                  ) : 'No disponible'}
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
                  {camion.ruta_pdf_cert_humofisomeca ? (
                    <a download="certificado_humos_fisomecanicas" href={camion.ruta_pdf_cert_humofisomeca}>Descargar</a>
                  ) : 'No disponible'}
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
