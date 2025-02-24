'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

const CrearCamion: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_transportista: '',
    placa_rodaje: '',
    clase_vehiculo: '',
    nro_ejes: '',
    año_fabricacion: '',
    serie_chasis: '',
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
    pdf_tarjeta_propiedad: null as File | null
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
    if (!formData.nombre_transportista || !formData.placa_rodaje || !formData.clase_vehiculo || !formData.nro_ejes || !formData.año_fabricacion || !formData.serie_chasis || !formData.seguro_compañia || !formData.fecha_pago_seguro || !formData.fecha_seguro || !formData.fecha_cond_diso_emi || !formData.fecha_cond_diso_ven || !formData.fecha_humo_diso_emi || !formData.fecha_humo_diso_ven) {
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
          formData.pdf_tarjeta_propiedad
        ]);

        const camionData = {
          ...formData,
          pdf_poliza_seguro: filePaths[0] || null,
          pdf_seguro_pago: filePaths[1] || null,
          pdf_cert_fisomeca: filePaths[2] || null,
          pdf_cert_humofisomeca: filePaths[3] || null,
          pdf_tarjeta_propiedad: filePaths[4] || null
        };

        try {
          const response = await axios.post('/api/auth/camiones', camionData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response) {
            Swal.fire('Guardado', 'Los cambios se han guardado correctamente.', 'success').then(() => {
              router.push('/pages/unidades/vehiculos');
            });
          } else {
            console.log('Invalid data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });
  };

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <form className="form_s crear_camion" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <h4>Habilitación Vehicular</h4>
            <div className="group">
              <div className="label">Nombre o razón social del transportista</div>
              <input name="nombre_transportista" type="text" className="form-control" value={formData.nombre_transportista} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Placa de Tracto</div>
              <input name="placa_rodaje" type="text" className="form-control" value={formData.placa_rodaje} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Clase de vehículo</div>
              <input name="clase_vehiculo" type="text" className="form-control" value={formData.clase_vehiculo} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Nro ejes</div>
              <input name="nro_ejes" type="text" className="form-control" value={formData.nro_ejes} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Año fabricación</div>
              <input name="año_fabricacion" type="text" className="form-control" value={formData.año_fabricacion} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Número o serie del chasis</div>
              <input name="serie_chasis" type="text" className="form-control" value={formData.serie_chasis} onChange={handleChange} />
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
            <div className="group_separate"></div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Tarjeta de circulación</div>
              <input name="pdf_tarjeta_propiedad" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${formData.pdf_tarjeta_propiedad ? 'si' : 'no'}`}></div>
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

export default CrearCamion;
