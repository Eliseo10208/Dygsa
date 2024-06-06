
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Remolque {
  id: string;
  nombre: string;
  placa: string;
  marca: string;
  seguro: string;
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
  folder: string;
}

const EditarRemolque = ({ id }: { id: string }) => {
  const [remolque, setRemolque] = useState<Remolque | null>(null);

  useEffect(() => {
    const fetchRemolque = async () => {
      // Simula la obtención de datos del remolque
      // const response = await axios.get(`/api/remolque/${id}`);
      // setRemolque(response.data);
      setRemolque({
        id: '1',
        nombre: 'Transportista A',
        placa: 'ABC-123',
        marca: 'Marca A',
        seguro: 'Seguros ABC',
        fecha_pago_seguro: '2023-01-01',
        fecha_seguro: '2024-01-01',
        pdf_poliza_seguro: '',
        pdf_seguro_pago: '',
        fecha_cond_diso_emi: '2023-01-01',
        fecha_cond_diso_ven: '2024-01-01',
        pdf_cert_fisomeca: '',
        fecha_humo_diso_emi: '2023-01-01',
        fecha_humo_diso_ven: '2024-01-01',
        pdf_cert_humofisomeca: '',
        pdf_informacion_remolque: '',
        folder: 'folder_a'
      });
    };

    fetchRemolque();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Simula el envío del formulario
    // await axios.post('/api/remolque/editar', formData);
    console.log('Form submitted', formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const statusElement = input.parentElement?.querySelector('.status');
    if (statusElement) {
      statusElement.classList.remove('no');
      statusElement.classList.add(input.files?.length ? 'si' : 'no');
    }
  };

  if (!remolque) return <div>Loading...</div>;

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>Regresar</button>
      <div className="panel-header">
        <div className="title">
          Editar un remolque
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s editar_remolque" onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '60px' }}>
        <input name="id" type="hidden" value={remolque.id} />
        <div className="row">
          <div className="col-md-6">
            <h4>Cert. Habilitación Vehicular</h4>
            <div className="group">
              <div className="label">Nombre o razón social del transportista</div>
              <input name="nombre_transportista" type="text" className="form-control" defaultValue={remolque.nombre} />
            </div>
            <div className="group">
              <div className="label">Placa de rodaje</div>
              <input name="placa_rodaje" type="text" className="form-control" defaultValue={remolque.placa} />
            </div>
            <div className="group">
              <div className="label">Marca</div>
              <input name="marca" type="text" className="form-control" defaultValue={remolque.marca} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Poliza de seguro</h5>
            <div className="group">
              <div className="label">Compañia</div>
              <input name="seguro_compañia" type="text" className="form-control" defaultValue={remolque.seguro} />
            </div>
            <div className="group">
              <div className="label">Fecha de pago poliza</div>
              <input name="fecha_pago_seguro" type="date" className="form-control" defaultValue={remolque.fecha_pago_seguro} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_seguro" type="date" className="form-control" defaultValue={remolque.fecha_seguro} />
            </div>
            <div className="group">
              <div className="label">Poliza de seguro</div>
              <input name="pdf_poliza_seguro" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className={`status ${remolque.pdf_poliza_seguro ? 'si' : 'no'}`}></div>
            </div>
            <div className="group">
              <div className="label">Ficha de pago</div>
              <input name="pdf_seguro_pago" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className={`status ${remolque.pdf_seguro_pago ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de condiciones fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_cond_diso_emi" type="date" className="form-control" defaultValue={remolque.fecha_cond_diso_emi} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_cond_diso_ven" type="date" className="form-control" defaultValue={remolque.fecha_cond_diso_ven} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_fisomeca" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className={`status ${remolque.pdf_cert_fisomeca ? 'si' : 'no'}`}></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de humos fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_humo_diso_emi" type="date" className="form-control" defaultValue={remolque.fecha_humo_diso_emi} />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_humo_diso_ven" type="date" className="form-control" defaultValue={remolque.fecha_humo_diso_ven} />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_humofisomeca" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className={`status ${remolque.pdf_cert_humofisomeca ? 'si' : 'no'}`}></div>
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Información de remolque</div>
              <input name="pdf_informacion_remolque" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className={`status ${remolque.pdf_informacion_remolque ? 'si' : 'no'}`}></div>
            </div>
            <div className="submit">
              <button type="submit" className="btn btn-success">Guardar datos</button>
            </div>
            <div className="upload-data"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarRemolque;
