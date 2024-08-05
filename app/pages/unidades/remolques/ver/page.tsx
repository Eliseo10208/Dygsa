'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Remolque {
  id: number;
  nombre_transportista: string;
  placa_rodaje: string;
  marca: string;
  seguro_compañia: string;
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
  pdf_informacion_remolque: string;
}

const DetallesRemolque: React.FC = () => {
  const [remolque, setRemolque] = useState<Partial<Remolque>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const remolqueId = searchParams.get('id');

  useEffect(() => {
    const fetchRemolque = async () => {
      try {
        const response = await axios.get(`/api/auth/remolques/${remolqueId}`);
        setRemolque(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching remolque:', error);
        router.push('/pages/remolques');
      }
    };

    if (remolqueId) {
      fetchRemolque();
    }
  }, [remolqueId]);

  if (!remolque) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Detalles del remolque
          <p>Administración de transporte de carga</p>
        </div>
        <div className="buttons">
          <div className="column"></div>
          <div className="column">
            <button
              className="btn btn-orange2"
              onClick={() => router.push(`/pages/unidades/remolques/edit/?id=${remolque.id}`)}
            >
              Editar remolque
            </button>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: '35px' }}>
        <div className="col-md-6">
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Nombre del transportista</div></div>
                <div className="value">{remolque.nombre_transportista}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Placa de rodaje</div></div>
                <div className="value">{remolque.placa_rodaje}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Marca</div></div>
                <div className="value">{remolque.marca}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Poliza de seguro</div></div>
                <div className="value">
                  {remolque.pdf_poliza_seguro && (
                    <a
                      download="poliza_seguro"
                      href={remolque.pdf_poliza_seguro}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Ficha de pago</div></div>
                <div className="value">
                  {remolque.pdf_seguro_pago && (
                    <a
                      download="seguro_pago"
                      href={remolque.pdf_seguro_pago}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Certificado fisomecánicas</div></div>
                <div className="value">
                  {remolque.pdf_cert_fisomeca && (
                    <a
                      download="certificado_fisomecanicas"
                      href={remolque.pdf_cert_fisomeca}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Certificado de humos</div></div>
                <div className="value">
                  {remolque.pdf_cert_humofisomeca && (
                    <a
                      download="certificado_humos"
                      href={remolque.pdf_cert_humofisomeca}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">Información del remolque</div></div>
                <div className="value">
                  {remolque.pdf_informacion_remolque && (
                    <a
                      download="informacion_remolque"
                      href={remolque.pdf_informacion_remolque}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Compañia de seguro</div></div>
                <div className="value">{remolque.seguro_compañia}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de pago del seguro</div></div>
                <div className="value">{remolque.fecha_pago_seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento del seguro</div></div>
                <div className="value">{remolque.fecha_seguro}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de emisión del certificado fisomecánicas</div></div>
                <div className="value">{remolque.fecha_cond_diso_emi}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento del certificado fisomecánicas</div></div>
                <div className="value">{remolque.fecha_cond_diso_ven}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de emisión del certificado de humos</div></div>
                <div className="value">{remolque.fecha_humo_diso_emi}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento del certificado de humos</div></div>
                <div className="value">{remolque.fecha_humo_diso_ven}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesRemolque;
