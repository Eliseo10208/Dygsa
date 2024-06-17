'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Conductor {
  id: string;
  nombre: string;
  fecha_nacimiento: string;
  direccion: string;
  celular: string;
  tipo_licencia: string;
  nro_licencia: string;
  categoria: string;
  fecha_venc_licencia: string;
  fecha_venc_rcontrol: string;
  fecha_venc_exmedico: string;
  file_licencia: string;
  file_r_control: string;
  file_examen_medico: string;
  folder: string;
}

const DetallesConductor: React.FC = () => {
  const [conductor, setConductor] = useState<Conductor | null>({
    id: '1',
    nombre: 'Juan Pérez',
    fecha_nacimiento: '1980-05-15',
    direccion: '123 Calle Falsa, Ciudad',
    celular: '555-1234',
    tipo_licencia: 'Local',
    nro_licencia: 'ABC123456',
    categoria: 'A',
    fecha_venc_licencia: '2024-12-31',
    fecha_venc_rcontrol: '2024-06-30',
    fecha_venc_exmedico: '2024-11-15',
    file_licencia: 'licencia.pdf',
    file_r_control: 'r_control.pdf',
    file_examen_medico: 'examen_medico.pdf',
    folder: '1234'
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const conductorId = searchParams.get('id');

  useEffect(() => {
    // Descomentar esto para obtener datos reales de la API
    /*
    const fetchConductor = async () => {
      try {
        const response = await axios.get(`/api/conductores/${conductorId}`);
        setConductor(response.data);
      } catch (error) {
        console.error('Error fetching conductor:', error);
        router.push('/conductores');
      }
    };

    if (conductorId) {
      fetchConductor();
    }
    */
  }, [conductorId]);

  if (!conductor) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Detalles del conductor
          <p>Administración de transporte de carga</p>
        </div>
        <div className="buttons">
          <div className="column"></div>
          <div className="column">
            <button
              className="btn btn-orange2"
              onClick={() => router.push(`/conductores?q=editar&d=${conductor.id}`)}
            >
              Editar conductor
            </button>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: '35px' }}>
        <div className="col-md-6">
          <div className="view-list">
            <ul>
              <li>
                <div className="name"><div className="ct">Tipo de licencia</div></div>
                <div className="value">{conductor.tipo_licencia}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Nombre</div></div>
                <div className="value">{conductor.nombre}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de nacimiento</div></div>
                <div className="value">{conductor.fecha_nacimiento}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Telefono</div></div>
                <div className="value">{conductor.celular}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Dirección</div></div>
                <div className="value">{conductor.direccion}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Licencia</div></div>
                <div className="value">
                  {conductor.file_licencia && (
                    <a
                      download="licencia"
                      href={`/uploads/${conductor.folder}/licencia.pdf`}
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </li>
              <li>
                <div className="name"><div className="ct">R Control</div></div>
                <div className="value">
                  {conductor.file_r_control && (
                    <a
                      download="r_control"
                      href={`/uploads/${conductor.folder}/r_control.pdf`}
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
                <div className="name"><div className="ct">Nº de documento</div></div>
                <div className="value">{conductor.nro_licencia}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Categoria</div></div>
                <div className="value">{conductor.categoria}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento de licencia</div></div>
                <div className="value">{conductor.fecha_venc_licencia}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento de Rcontrol</div></div>
                <div className="value">{conductor.fecha_venc_rcontrol}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Fecha de vencimiento de examen médico</div></div>
                <div className="value">{conductor.fecha_venc_exmedico}</div>
              </li>
              <li>
                <div className="name"><div className="ct">Examen médico</div></div>
                <div className="value">
                  {conductor.file_examen_medico && (
                    <a
                      download="examen_medico"
                      href={`/uploads/${conductor.folder}/examen_medico.pdf`}
                    >
                      Descargar
                    </a>
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

export default DetallesConductor;
