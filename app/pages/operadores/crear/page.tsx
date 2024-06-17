'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CrearEmpleados: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_nacimiento: '',
    direccion: '',
    celular: '',
    tipo_licencia: 'Local',
    nro_licencia: '',
    categoria: '',
    fecha_venc_licencia: '',
    fecha_venc_rcontrol: '',
    fecha_venc_exmedico: '',
    file_licencia: null as File | null,
    file_r_control: null as File | null,
    file_examen_medico: null as File | null
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // const { name, value, files } = e.target;
    // if (files) {
    //   setFormData({
    //     ...formData,
    //     [name]: files[0]
    //   });
    // } else {
    //   setFormData({
    //     ...formData,
    //     [name]: value
    //   });
    // }
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
      const response = await axios.post('/api/upload', formDataToSend, {
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

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <form className="form_s crear_empleados" onSubmit={handleSubmit} encType="multipart/form-data">
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
              <div className="label">Tipo de licencia</div>
              <select name="tipo_licencia" className="form-control" value={formData.tipo_licencia} onChange={handleChange}>
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
              <option value="A"></option>
                <option value="A">Propio</option>
                <option value="B">Promisionario</option>
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

export default CrearEmpleados;
