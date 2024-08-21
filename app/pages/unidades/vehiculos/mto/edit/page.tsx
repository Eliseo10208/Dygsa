'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const EditarMantenimiento: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mantenimientoId = searchParams.get('id');
  const [formData, setFormData] = useState({
    camion_id: '',
    tipo_mantenimiento: 'preventivo',
    descripcion: '',
    fecha_mantenimiento: '',
    costo: '',
    pdf_url: null as File | null, // Archivo a subir
    existingPdfUrl: '' // Para almacenar la URL del PDF existente
  });

  useEffect(() => {
    const fetchMantenimiento = async () => {
      try {
        const response = await axios.get(`/api/auth/mantenimiento-camion/${mantenimientoId}`);
        const data = response.data[0];

        setFormData({
          camion_id: data.camion_id,
          tipo_mantenimiento: data.tipo_mantenimiento,
          descripcion: data.descripcion,
          fecha_mantenimiento: data.fecha_mantenimiento,
          costo: data.costo,
          pdf_url: null, // Inicialmente, no hay nuevo archivo subido
          existingPdfUrl: data.ruta_pdf_mantenimiento || ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Hubo un error al cargar los datos del mantenimiento.', 'error');
      }
    };

    fetchMantenimiento();
  }, [mantenimientoId]);

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
        pdf_url: e.target.files[0]
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
      return response.data.fileUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire('Error', 'Hubo un error al subir el archivo. Por favor, inténtalo de nuevo.', 'error');
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo_mantenimiento || !formData.fecha_mantenimiento || !formData.costo || !formData.camion_id) {
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
        let pdfUrl = formData.existingPdfUrl;

        if (formData.pdf_url) {
          const uploadedFiles = await handleFileUpload([formData.pdf_url]);

          if (uploadedFiles.length === 0) {
            return;
          }

          pdfUrl = uploadedFiles[0];
        }

        const mantenimientoData = {
          camion_id: formData.camion_id,
          tipo_mantenimiento: formData.tipo_mantenimiento,
          descripcion: formData.descripcion,
          fecha_mantenimiento: formData.fecha_mantenimiento,
          costo: formData.costo,
          ruta_pdf_mantenimiento: pdfUrl
        };

        try {
          const response = await axios.put(`/api/auth/mantenimiento-camion/${mantenimientoId}`, mantenimientoData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data) {
            Swal.fire('Guardado', 'El mantenimiento se ha actualizado correctamente.', 'success').then(() => {
              router.push(`/pages/unidades/vehiculos/mto?id=${formData.camion_id}`);
            });
          } else {
            console.log('Invalid data');
            Swal.fire('Error', 'Datos inválidos. Por favor, revisa la información.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Hubo un error al actualizar el mantenimiento. Por favor, inténtalo de nuevo.', 'error');
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
          Editar mantenimiento Nº {mantenimientoId}
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s editar_mantenimiento" onSubmit={handleSubmit}>
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
              <div className={`status ${formData.pdf_url || formData.existingPdfUrl ? 'si' : 'no'}`}></div>
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

export default EditarMantenimiento;
