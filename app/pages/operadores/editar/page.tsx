'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Operador {
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
}

const EditarOperador: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Operador>>({});
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [fileLicencia, setFileLicencia] = useState<File | null>(null);
  const [fileRControl, setFileRControl] = useState<File | null>(null);
  const [fileExamenMedico, setFileExamenMedico] = useState<File | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const operadorId = searchParams.get('id');

  useEffect(() => {
    if (operadorId && initialLoad) {
      const fetchOperador = async () => {
        try {
          const response = await axios.get(`/api/auth/empleados/${operadorId}`);
          const operadorData = response.data;

          const formatDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };

          setFormData({
            ...operadorData,
            fecha_nacimiento: formatDate(operadorData.fecha_nacimiento),
            fecha_venc_licencia: formatDate(operadorData.fecha_venc_licencia),
            fecha_venc_rcontrol: formatDate(operadorData.fecha_venc_rcontrol),
            fecha_venc_exmedico: formatDate(operadorData.fecha_venc_exmedico),
          });
          setInitialLoad(false);
        } catch (error) {
          console.error('Error fetching operador:', error);
        }
      };

      fetchOperador();
    }
  }, [operadorId, initialLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      if (name === 'file_licencia') setFileLicencia(files[0]);
      if (name === 'file_r_control') setFileRControl(files[0]);
      if (name === 'file_examen_medico') setFileExamenMedico(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFileUpload = async (files: (File | null)[]) => {
    const fileFormData = new FormData();
    files.forEach((file) => {
      if (file) {
        fileFormData.append('file', file);
      }
    });

    try {
      const response = await axios.post('/api/auth/upload', fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.fileUrls; // Asumiendo que el servidor devuelve una lista de URLs de archivos
    } catch (error) {
      console.error('Error uploading files:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.fecha_nacimiento || !formData.direccion || !formData.celular || !formData.tipo_licencia || !formData.nro_licencia || !formData.categoria || !formData.fecha_venc_licencia || !formData.fecha_venc_rcontrol || !formData.fecha_venc_exmedico) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres guardar los cambios?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const filesToUpload = [fileLicencia, fileRControl, fileExamenMedico];
        const uploadedFilePaths = filesToUpload.some(file => file) ? await handleFileUpload(filesToUpload) : [];

        const operadorData = {
          ...formData,
          file_licencia: uploadedFilePaths[0] || formData.file_licencia,
          file_r_control: uploadedFilePaths[1] || formData.file_r_control,
          file_examen_medico: uploadedFilePaths[2] || formData.file_examen_medico
        };

        try {
          const response = await axios.put(`/api/auth/empleados/${operadorId}`, operadorData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = response.data;

          if (data) {
            Swal.fire('Guardado', 'Los cambios se han guardado correctamente.', 'success').then(() => {
              router.push('/pages/operadores');
            });
          } else {
            console.log(data);
            console.log('Invalid data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });
  };

  if (initialLoad) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <form className="form_s editar_operadores" onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="id" type="hidden" value={formData.id || ''} />
        <div className="row">
          <div className="col-md-6">
            <div className="group">
              <div className="label">Nombres</div>
              <input name="nombre" type="text" className="form-control" value={formData.nombre || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de nacimiento</div>
              <input name="fecha_nacimiento" type="date" className="form-control" value={formData.fecha_nacimiento || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Dirección</div>
              <input name="direccion" type="text" className="form-control" value={formData.direccion || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Telefono</div>
              <input name="celular" type="text" className="form-control" value={formData.celular || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="group">
              <div className="label">Tipo de licencia</div>
              <select name="tipo_licencia" className="form-control" value={formData.tipo_licencia || 'Local'} onChange={handleChange}>
                <option value="Local">Local</option>
                <option value="Federal">Federal</option>
              </select>
            </div>
            <div className="group">
              <div className="label">Nº de licencia</div>
              <input name="nro_licencia" type="text" className="form-control" value={formData.nro_licencia || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Categoria</div>
              <select name="categoria" className="form-control" value={formData.categoria || 'Propio'} onChange={handleChange}>
                <option value="Propio">Propio</option>
                <option value="Promisionario">Promisionario</option>
              </select>
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de licencia</div>
              <input name="fecha_venc_licencia" type="date" className="form-control" value={formData.fecha_venc_licencia || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de Rcontrol</div>
              <input name="fecha_venc_rcontrol" type="date" className="form-control" value={formData.fecha_venc_rcontrol || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento de examen medico</div>
              <input name="fecha_venc_exmedico" type="date" className="form-control" value={formData.fecha_venc_exmedico || ''} onChange={handleChange} />
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Licencia</div>
              <input name="file_licencia" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileLicencia ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">R Control</div>
              <input name="file_r_control" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileRControl ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Examen medico</div>
              <input name="file_examen_medico" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileExamenMedico ? 'si' : 'no'}`}></div>
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

export default EditarOperador;
