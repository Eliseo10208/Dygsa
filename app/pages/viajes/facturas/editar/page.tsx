'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const EditarFactura: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facturaId = searchParams.get('id');
  const [formData, setFormData] = useState({
    nro_factura: '',
    orden_carga_id: '',  // Mantiene el orden_carga_id
    monto: '',
    monto_iva: '',
    monto_retencion: '',
    total: '',
    pdf_url: null as File | null, // Archivo a subir
    existing_pdf_url: '' // URL del archivo existente
  });

  // Cargar los datos de la factura al montar el componente
  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const response = await axios.get(`/api/auth/facturas/${facturaId}`);
        const data = response.data[0];

        setFormData({
          nro_factura: data.nro_factura,
          orden_carga_id: data.orden_carga_id,
          monto: data.monto,
          monto_iva: data.monto_iva,
          monto_retencion: data.monto_retencion,
          total: data.total,
          pdf_url: null,
          existing_pdf_url: data.pdf_url
        });
      } catch (error) {
        console.error('Error fetching factura:', error);
        Swal.fire('Error', 'No se pudo cargar la factura. Por favor, inténtalo de nuevo.', 'error');
      }
    };

    if (facturaId) {
      fetchFactura();
    }
  }, [facturaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'monto') {
      calculateMonto(value, '16', '3'); // Suponiendo valores fijos de IVA y retención
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        pdf_url: e.target.files[0] // Archivo PDF a subir
      });
    }
  };

  const calculateMonto = (monto: string, ivaPorcentaje: string, retencionPorcentaje: string) => {
    const montoNum = parseFloat(monto);
    const iva = (parseFloat(ivaPorcentaje) * montoNum) / 100;
    const retencion = (parseFloat(retencionPorcentaje) * montoNum) / 100;
    const total = montoNum + iva - retencion;

    setFormData((prevFormData) => ({
      ...prevFormData,
      monto_iva: iva.toFixed(2),
      monto_retencion: retencion.toFixed(2),
      total: total.toFixed(2)
    }));
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
    if (!formData.nro_factura || !formData.monto || !formData.orden_carga_id) {
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
        let pdfUrl = formData.existing_pdf_url;

        if (formData.pdf_url) {
          const uploadedFiles = await handleFileUpload([formData.pdf_url]);
          if (uploadedFiles.length > 0) {
            pdfUrl = uploadedFiles[0];
          } else {
            return; // Detiene la ejecución si la subida del archivo falla
          }
        }

        const facturaData = {
          nro_factura: formData.nro_factura,
          orden_carga_id: formData.orden_carga_id,
          monto: formData.monto,
          monto_iva: formData.monto_iva,
          monto_retencion: formData.monto_retencion,
          total: formData.total,
          pdf_url: pdfUrl
        };

        try {
          const response = await axios.put(`/api/facturas/${facturaId}`, facturaData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = response.data;

          if (data) {
            Swal.fire('Guardado', 'La factura se ha actualizado correctamente.', 'success').then(() => {
              router.push('/pages/viajes/facturas?id=' + formData.orden_carga_id);
            });
          } else {
            console.log('Invalid data');
            Swal.fire('Error', 'Datos inválidos. Por favor, revisa la información.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Hubo un error al actualizar la factura. Por favor, inténtalo de nuevo.', 'error');
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
          Editar factura Nº {facturaId}
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s editar_factura" onSubmit={handleSubmit}>
        <div className="row justify-content-md-center">
          <div className="col-md-8">
            <div className="group">
              <div className="label">Nº de factura</div>
              <input
                name="nro_factura"
                type="text"
                className="form-control"
                value={formData.nro_factura}
                onChange={handleChange}
                required
              />
            </div>
            <div className="group">
              <div className="label">Monto</div>
              <input
                name="monto"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.monto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="group">
              <div className="label">Monto IVA</div>
              <input
                name="monto_iva"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.monto_iva}
                readOnly
              />
            </div>
            <div className="group">
              <div className="label">Monto Retención</div>
              <input
                name="monto_retencion"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.monto_retencion}
                readOnly
              />
            </div>
            <div className="group">
              <div className="label">Total</div>
              <input
                name="total"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.total}
                readOnly
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
              {formData.existing_pdf_url && (
                <div className="existing-file">
                  <a href={formData.existing_pdf_url} target="_blank" rel="noopener noreferrer">
                    Ver archivo existente
                  </a>
                </div>
              )}
            </div>
            <div className="submit">
              <button type="submit" className="btn btn-success">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarFactura;
