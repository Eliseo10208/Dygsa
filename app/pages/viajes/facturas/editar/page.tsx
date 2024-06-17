// components/EditFactura.tsx
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditFacturaProps {
  onBack: () => void;
  facturaId: string;
}

const EditFactura: React.FC<EditFacturaProps> = ({ onBack, facturaId }) => {
  const [formData, setFormData] = useState({
    nro_factura: '',
    monto: '',
    monto_iva: '',
    monto_retención: '',
    total: '',
    file_factura: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Fetch factura data on mount
    const fetchFacturaData = async () => {
      try {
        const response = await axios.get(`/system/Actions/ordencarga/facturas/${facturaId}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching factura data:', error);
      }
    };

    fetchFacturaData();
  }, [facturaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'monto') {
      calculateMonto(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
    //   setFormData({
    //     ...formData,
    //     file_factura: e.target.files[0]
    //   });
    }
  };

  const calculateMonto = (monto: string) => {
    const montoNum = parseFloat(monto);
    const iva = (14 * montoNum) / 100;
    const retencion = (3 * montoNum) / 100;
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
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    try {
      const response = await axios.post('/system/Actions/ordencarga/facturas/editar.php', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data.status === 'success') {
        onBack();
      } else if (data.status === 'invalid') {
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
          Editar una factura
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
              <div className="label">IVA (14%)</div>
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
              <div className="label">Retención (3%)</div>
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

export default EditFactura;
