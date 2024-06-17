
'use client'
import React, { useState } from 'react';
import axios from 'axios';

const CrearRemolque = () => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Simula el envío del formulario
    // await axios.post('/api/remolque/crear', formData);
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
              <input name="nombre_transportista" type="text" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Placa de plana</div>
              <input name="placa_rodaje" type="text" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Marca</div>
              <input name="marca" type="text" className="form-control" />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Poliza de seguro</h5>
            <div className="group">
              <div className="label">Compañia</div>
              <input name="seguro_compañia" type="text" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Fecha de pago poliza</div>
              <input name="fecha_pago_seguro" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_seguro" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Poliza de seguro</div>
              <input name="pdf_poliza_seguro" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className="status no"></div>
            </div>
            <div className="group">
              <div className="label">Ficha de pago</div>
              <input name="pdf_seguro_pago" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className="status no"></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de condiciones fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_cond_diso_emi" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_cond_diso_ven" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_fisomeca" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className="status no"></div>
            </div>
            <div className="group_separate"></div>
            <h5>Certificado de humos fisomecánicas</h5>
            <div className="group">
              <div className="label">Fecha de emisión</div>
              <input name="fecha_humo_diso_emi" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Fecha de vencimiento</div>
              <input name="fecha_humo_diso_ven" type="date" className="form-control" />
            </div>
            <div className="group">
              <div className="label">Certificado</div>
              <input name="pdf_cert_humofisomeca" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className="status no"></div>
            </div>
            <h5>Archivos PDF</h5>
            <div className="group">
              <div className="label">Información de remolque</div>
              <input name="pdf_informacion_remolque" type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
              <div className="status no"></div>
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

export default CrearRemolque;
