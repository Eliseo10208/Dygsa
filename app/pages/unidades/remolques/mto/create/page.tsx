'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const CrearMantenimientoRemolque: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const remolqueId = searchParams.get('id');
  const [formData, setFormData] = useState({
    remolque_id: remolqueId, // Mantiene el remolque_id
    tipo_mantenimiento: 'preventivo', // Valor por defecto
    descripcion: '',
    fecha_mantenimiento: '',
    costo: '',
    pdf_url: null as File | null // Archivo a subir
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        pdf_url: e.target.files[0] // Archivo PDF a subir
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
      Swal.fire('Error', 'Hubo un error al subir el archivo. Por favor, inténtalo de nuevo.', 'error');
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios antes de enviar
    if (!formData.tipo_mantenimiento || !formData.fecha_mantenimiento || !formData.costo || !formData.remolque_id) {
      Swal.fire('Alerta!', 'Todos los campos son obligatorios.', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const pdfUrl = await handleFileUpload([formData.pdf_url]);

        if (pdfUrl.length === 0) {
          return; // Detiene la ejecución si la subida del archivo falla
        }

        const mantenimientoData = {
          remolque_id: formData.remolque_id,
          tipo_mantenimiento: formData.tipo_mantenimiento,
          descripcion: formData.descripcion,
          fecha_mantenimiento: formData.fecha_mantenimiento,
          costo: formData.costo,
          ruta_pdf_mantenimiento: pdfUrl[0] || null
        };

        try {
          const response = await axios.post('/api/auth/mantenimiento-remolque', mantenimientoData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = response.data;

          if (data) {
            Swal.fire('Guardado', 'El mantenimiento se ha guardado correctamente.', 'success').then(() => {
              router.push(`/pages/unidades/remolques/mto?id=${remolqueId}`);
            });
          } else {
            console.log('Invalid data');
            Swal.fire('Error', 'Datos inválidos. Por favor, revisa la información.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Hubo un error al guardar el mantenimiento. Por favor, inténtalo de nuevo.', 'error');
        }
      }
    });
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Agregar un mantenimiento para el remolque Nº {remolqueId}
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s crear_mantenimiento" onSubmit={handleSubmit}>
        <div className="row justify-content-md-center">
          <div className="col-md-8">
            <div className="group">
              <div className="label">Tipo de Mantenimiento</div>
              <select
                name="tipo_mantenimiento"
                className="form-control"
                value={formData.tipo_mantenimiento}
                onChange={handleChange}
                required
              >
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
            </div>
            <div className="group">
              <div className="label">Descripción</div>
              <input
                name="descripcion"
                type="text"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Fecha de Mantenimiento</div>
              <input
                name="fecha_mantenimiento"
                type="date"
                className="form-control"
                value={formData.fecha_mantenimiento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="group">
              <div className="label">Costo</div>
              <input
                name="costo"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.costo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="group">
              <div className="label">Archivo (PDF / Imagen)</div>
              <input
                name="pdf_url"
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <div className={`status ${formData.pdf_url ? 'si' : 'no'}`}></div>
            </div>
            <div className="submit">
              <button type="submit" className="btn btn-success">
                Guardar datos
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CrearMantenimientoRemolque;
