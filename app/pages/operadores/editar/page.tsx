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
  tipo_doc: string;
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

const EditarEmpleado: React.FC = () => {
  const [conductor, setConductor] = useState<Conductor | null>({
    id: '1',
    nombre: 'Juan Pérez',
    fecha_nacimiento: '1980-05-15',
    direccion: '123 Calle Falsa, Ciudad',
    celular: '555-1234',
    tipo_doc: 'Local',
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
  const [formData, setFormData] = useState({
    id: '1',
    nombre: 'Juan Pérez',
    fecha_nacimiento: '1980-05-15',
    direccion: '123 Calle Falsa, Ciudad',
    celular: '555-1234',
    tipo_doc: 'Local',
    nro_licencia: 'ABC123456',
    categoria: 'A',
    fecha_venc_licencia: '2024-12-31',
    fecha_venc_rcontrol: '2024-06-30',
    fecha_venc_exmedico: '2024-11-15',
    file_licencia: null as File | null,
    file_r_control: null as File | null,
    file_examen_medico: null as File | null
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
        const conductorData = response.data;
        setConductor(conductorData);
        setFormData({
          ...formData,
          id: conductorData.id,
          nombre: conductorData.nombre,
          fecha_nacimiento: conductorData.fecha_nacimiento,
          direccion: conductorData.direccion,
          celular: conductorData.celular,
          tipo_doc: conductorData.tipo_doc,
          nro_licencia: conductorData.nro_licencia,
          categoria: conductorData.categoria,
          fecha_venc_licencia: conductorData.fecha_venc_licencia,
          fecha_venc_rcontrol: conductorData.fecha_venc_rcontrol,
          fecha_venc_exmedico: conductorData.fecha_venc_exmedico,
          file_licencia: null,
          file_r_control: null,
          file_examen_medico: null
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData]) {
        formDataToSend.append(key, formData[key as keyof typeof formData] as string | Blob);
      }
    });

    try {
      const response = await axios.post('/api/conductores/editar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data.status === 'success') {
        router.push(`/conductores?q=ver&d=${data.id}`);
      } else {
        console.log('Invalid data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!conductor) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <form className="form_s editar_empleados" onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="id" type="hidden" value={formData.id} />
        <div className="row">
          <div className="col-md-6">
            <div className="group">
              <div className="label">Nombres</div>
              <input name="nombre" type="text" className="form-control" value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de nacimiento</div>
              <input name="fecha_nacimiento" type="date" className="form-control" value={formData.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Dirección</div>
              <input name="direccion" type="text" className="form-control" value={formData.direccion} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Telefono</div>
              <input name="celular" type="text" className="form-control" value={formData.celular} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="group">
              <div className="label">Tipo de documento</div>
              <select name="tipo_doc" className="form-control" value={formData.tipo_doc} onChange={handleChange}>
                <option value="Local">Local</option>
                <option value="Federal">Federal</option>
              </select>
            </div>
            <div className="group">
              <div className="label">Nº de licencia</div>
              <input name="nro_licencia" type="text" className="form-control" value={formData.nro_licencia} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Categoria</div>
              <select name="categoria" className="form-control" value={formData.categoria} onChange={handleChange}>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de licencia</div>
              <input name="fecha_venc_licencia" type="date" className="form-control" value={formData.fecha_venc_licencia} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de Rcontrol</div>
              <input name="fecha_venc_rcontrol" type="date" className="form-control" value={formData.fecha_venc_rcontrol} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de examen medico</div>
              <input name="fecha_venc_exmedico" type="date" className="form-control" value={formData.fecha_venc_exmedico} onChange={handleChange} />
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Licencia</div>
              <input name="file_licencia" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.file_licencia ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">R Control</div>
              <input name="file_r_control" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.file_r_control ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Examen medico</div>
              <input name="file_examen_medico" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.file_examen_medico ? 'si' : 'no'}`}></div>
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

export default EditarEmpleado;
