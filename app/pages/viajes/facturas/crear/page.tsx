'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CrearFacturaProps {
  onBack: () => void;
  ordenId: string;
  nroManifiesto: string;
}

const CrearFactura: React.FC<CrearFacturaProps> = ({ onBack, ordenId, nroManifiesto }) => {
  const [formData, setFormData] = useState({
    nro_factura: '',
    monto: '',
    iva_porcentaje: '16',
    retencion_porcentaje: '3',
    monto_iva: '',
    monto_retención: '',
    total: '',
    file_factura: null as File | null
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'monto' || name === 'iva_porcentaje' || name === 'retencion_porcentaje') {
      calculateMonto(formData.monto, formData.iva_porcentaje, formData.retencion_porcentaje);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        file_factura: e.target.files[0]
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
      monto_retención: retencion.toFixed(2),
      total: total.toFixed(2)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('orden', ordenId);
    Object.keys(formData).forEach((key) => {
      if (key === 'file_factura' && formData.file_factura) {
        formDataToSend.append(key, formData.file_factura);
      } else {
        formDataToSend.append(key, formData[key as keyof typeof formData] as string);
      }
    });

    try {
      const response = await axios.post('/api/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data.data) {
        onBack();
      } else {
        console.log('Invalid data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => window.history.back()}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Agregar una factura en Nº {nroManifiesto}
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s crear_factura" onSubmit={handleSubmit}>
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
              <div className="label">IVA (%)</div>
              <input
                name="iva_porcentaje"
                type="number"
                step="0.01"
                placeholder="16"
                className="form-control"
                value={formData.iva_porcentaje}
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
              <div className="label">Retención (%)</div>
              <input
                name="retencion_porcentaje"
                type="number"
                step="0.01"
                placeholder="3"
                className="form-control"
                value={formData.retencion_porcentaje}
                onChange={handleChange}
                required
              />
            </div>
            <div className="group">
              <div className="label">Monto Retención</div>
              <input
                name="monto_retención"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="form-control"
                value={formData.monto_retención}
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
                name="file_factura"
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <div className={`status ${formData.file_factura ? 'si' : 'no'}`}></div>
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

export default CrearFactura;
