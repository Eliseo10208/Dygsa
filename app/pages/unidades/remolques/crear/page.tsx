'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

const CrearRemolque: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_transportista: '',
    placa_rodaje: '',
    marca: '',
    seguro_compañia: '',
    fecha_pago_seguro: '',
    fecha_seguro: '',
    pdf_poliza_seguro: null as File | null,
    pdf_seguro_pago: null as File | null,
    fecha_cond_diso_emi: '',
    fecha_cond_diso_ven: '',
    pdf_cert_fisomeca: null as File | null,
    fecha_humo_diso_emi: '',
    fecha_humo_diso_ven: '',
    pdf_cert_humofisomeca: null as File | null,
    pdf_informacion_remolque: null as File | null
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      setFormData({
        ...formData,
        [name]: e.target.files[0]
      });
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

    // Validar campos obligatorios antes de enviar
    if (!formData.nombre_transportista || !formData.placa_rodaje || !formData.marca || !formData.seguro_compañia || !formData.fecha_pago_seguro || !formData.fecha_seguro || !formData.fecha_cond_diso_emi || !formData.fecha_cond_diso_ven || !formData.fecha_humo_diso_emi || !formData.fecha_humo_diso_ven) {
      Swal.fire('Alerta!', 'Todos los campos son obligatorios.', 'warning');
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
        const filePaths = await handleFileUpload([
          formData.pdf_poliza_seguro,
          formData.pdf_seguro_pago,
          formData.pdf_cert_fisomeca,
          formData.pdf_cert_humofisomeca,
          formData.pdf_informacion_remolque
        ]);

        const remolqueData = {
          ...formData,
          pdf_poliza_seguro: filePaths[0] || null,
          pdf_seguro_pago: filePaths[1] || null,
          pdf_cert_fisomeca: filePaths[2] || null,
          pdf_cert_humofisomeca: filePaths[3] || null,
          pdf_informacion_remolque: filePaths[4] || null
        };

        try {
          const response = await axios.post('/api/auth/remolques', remolqueData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            Swal.fire('Guardado', 'Los cambios se han guardado correctamente.', 'success').then(() => {
              router.push('/pages/unidades/remolques');
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al guardar los datos.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Hubo un problema al guardar los datos.', 'error');
        }
      }
    });
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>Regresar</button>
      <div className="panel-header">
        <div className="title">
          Agregar un remolque
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s crear_remolque" onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '60px' }}>
        <div className="row">
          <div className="col-md-6">
            <h4>Cert. Habilitación Vehicular</h4>
            <div className="group">
              <div className="label">Nombre o razón social del transportista</div>
              <input name="nombre_transportista" type="text" className="form-control" value={formData.nombre_transportista} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Placa de plana</div>
              <input name="placa_rodaje" type="text" className="form-control" value={formData.placa_rodaje} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Marca</div>
              <input name="marca" type="text" className="form-control" value={formData.marca} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Poliza de seguro</h5>
            <div className="group">
              <div className="label">Compañia</div>
              <input name="seguro_compañia" type="text" className="form-control" value={formData.seguro_compañia} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de pago poliza</div>
              <input name="fecha_pago_seguro" type="date" className="form-control" value={formData.fecha_pago_seguro} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_seguro" type="date" className="form-control" value={formData.fecha_seguro} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Poliza de seguro</div>
              <input name="pdf_poliza_seguro" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_poliza_seguro ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Ficha de pago</div>
              <input name="pdf_seguro_pago" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_seguro_pago ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de condiciones fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_cond_diso_emi" type="date" className="form-control" value={formData.fecha_cond_diso_emi} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_cond_diso_ven" type="date" className="form-control" value={formData.fecha_cond_diso_ven} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_fisomeca" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_cert_fisomeca ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de humos fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_humo_diso_emi" type="date" className="form-control" value={formData.fecha_humo_diso_emi} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_humo_diso_ven" type="date" className="form-control" value={formData.fecha_humo_diso_ven} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_humofisomeca" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_cert_humofisomeca ? 'si' : 'no'}`}></div>
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Información de remolque</div>
              <input name="pdf_informacion_remolque" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_informacion_remolque ? 'si' : 'no'}`}></div>
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

export default CrearRemolque;
