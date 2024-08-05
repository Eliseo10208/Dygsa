'use client'
import React, { useEffect, useState } from 'react';
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

const EditarRemolque: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Remolque>>({});
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filePolizaSeguro, setFilePolizaSeguro] = useState<File | null>(null);
  const [fileSeguroPago, setFileSeguroPago] = useState<File | null>(null);
  const [fileCertFisomeca, setFileCertFisomeca] = useState<File | null>(null);
  const [fileCertHumofisomeca, setFileCertHumofisomeca] = useState<File | null>(null);
  const [fileInformacionRemolque, setFileInformacionRemolque] = useState<File | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const remolqueId = searchParams.get('id');

  useEffect(() => {
    if (remolqueId && initialLoad) {
      const fetchRemolque = async () => {
        try {
          const response = await axios.get(`/api/auth/remolques/${remolqueId}`);
          const remolqueData = response.data;

          const formatDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };

          setFormData({
            ...remolqueData,
            fecha_pago_seguro: formatDate(remolqueData.fecha_pago_seguro),
            fecha_seguro: formatDate(remolqueData.fecha_seguro),
            fecha_cond_diso_emi: formatDate(remolqueData.fecha_cond_diso_emi),
            fecha_cond_diso_ven: formatDate(remolqueData.fecha_cond_diso_ven),
            fecha_humo_diso_emi: formatDate(remolqueData.fecha_humo_diso_emi),
            fecha_humo_diso_ven: formatDate(remolqueData.fecha_humo_diso_ven),
          });
          setInitialLoad(false);
        } catch (error) {
          console.error('Error fetching remolque:', error);
        }
      };

      fetchRemolque();
    }
  }, [remolqueId, initialLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      if (name === 'pdf_poliza_seguro') setFilePolizaSeguro(files[0]);
      if (name === 'pdf_seguro_pago') setFileSeguroPago(files[0]);
      if (name === 'pdf_cert_fisomeca') setFileCertFisomeca(files[0]);
      if (name === 'pdf_cert_humofisomeca') setFileCertHumofisomeca(files[0]);
      if (name === 'pdf_informacion_remolque') setFileInformacionRemolque(files[0]);
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
        const filesToUpload = [
          filePolizaSeguro,
          fileSeguroPago,
          fileCertFisomeca,
          fileCertHumofisomeca,
          fileInformacionRemolque
        ];
        const uploadedFilePaths = filesToUpload.some(file => file) ? await handleFileUpload(filesToUpload) : [];

        const remolqueData = {
          ...formData,
          pdf_poliza_seguro: uploadedFilePaths[0] || formData.pdf_poliza_seguro,
          pdf_seguro_pago: uploadedFilePaths[1] || formData.pdf_seguro_pago,
          pdf_cert_fisomeca: uploadedFilePaths[2] || formData.pdf_cert_fisomeca,
          pdf_cert_humofisomeca: uploadedFilePaths[3] || formData.pdf_cert_humofisomeca,
          pdf_informacion_remolque: uploadedFilePaths[4] || formData.pdf_informacion_remolque
        };

        try {
          const response = await axios.put(`/api/auth/remolques/${remolqueId}`, remolqueData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = response.data;

          if (data) {
            Swal.fire('Guardado', 'Los cambios se han guardado correctamente.', 'success').then(() => {
              router.push('/pages/unidades/remolques');
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

  if (initialLoad) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="panel">
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Regresar
      </button>
      <form className="form_s editar_remolques" onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="id" type="hidden" value={formData.id || ''} />
        <div className="row">
          <div className="col-md-6">
            <h4>Cert. Habilitación Vehicular</h4>
            <div className="group">
              <div className="label">Nombre o razón social del transportista</div>
              <input name="nombre_transportista" type="text" className="form-control" value={formData.nombre_transportista || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Placa de rodaje</div>
              <input name="placa_rodaje" type="text" className="form-control" value={formData.placa_rodaje || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Marca</div>
              <input name="marca" type="text" className="form-control" value={formData.marca || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Poliza de seguro</h5>
            <div className="group">
              <div className="label">Compañia</div>
              <input name="seguro_compañia" type="text" className="form-control" value={formData.seguro_compañia || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de pago poliza</div>
              <input name="fecha_pago_seguro" type="date" className="form-control" value={formData.fecha_pago_seguro || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_seguro" type="date" className="form-control" value={formData.fecha_seguro || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Poliza de seguro</div>
              <input name="pdf_poliza_seguro" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${filePolizaSeguro ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Ficha de pago</div>
              <input name="pdf_seguro_pago" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileSeguroPago ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de condiciones fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_cond_diso_emi" type="date" className="form-control" value={formData.fecha_cond_diso_emi || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_cond_diso_ven" type="date" className="form-control" value={formData.fecha_cond_diso_ven || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_fisomeca" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileCertFisomeca ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de humos fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_humo_diso_emi" type="date" className="form-control" value={formData.fecha_humo_diso_emi || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_humo_diso_ven" type="date" className="form-control" value={formData.fecha_humo_diso_ven || ''} onChange={handleChange} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_humofisomeca" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileCertHumofisomeca ? 'si' : 'no'}`}></div>
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Información de remolque</div>
              <input name="pdf_informacion_remolque" type="file" className="form-control" accept=".pdf" onChange={handleChange} />
              <div className={`status ${fileInformacionRemolque ? 'si' : 'no'}`}></div>
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

export default EditarRemolque;
