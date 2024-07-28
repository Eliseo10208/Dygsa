// components/CrearCliente.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CrearClienteProps {
  onBack: () => void;
}

const CrearCliente: React.FC<CrearClienteProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    distrito: '',
    provincia: '',
    telefono: '',
    ruc: ''
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/clients', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (response.status === 200) {
        alert('Cliente creado con éxito');
        onBack();  // Navigate back to the list view
      } else {
        console.log('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="panel">
      <button className="back_btn"  onClick={() => router.push('/pages/clients')}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Agregar un nuevo cliente
          <p>Administración de transporte de carga</p>
        </div>
      </div>
      <form className="form_s crear_cliente" onSubmit={handleSubmit}>
        <div className="row justify-content-md-center">
          <div className="col-md-8">
            <div className="group">
              <div className="label">Nombre</div>
              <input
                name="nombre"
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Dirección</div>
              <input
                name="direccion"
                type="text"
                className="form-control"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Distrito</div>
              <input
                name="distrito"
                type="text"
                className="form-control"
                value={formData.distrito}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Provincia</div>
              <input
                name="provincia"
                type="text"
                className="form-control"
                value={formData.provincia}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Telefono</div>
              <input
                name="telefono"
                type="text"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">RUC</div>
              <input
                name="ruc"
                type="text"
                className="form-control"
                value={formData.ruc}
                onChange={handleChange}
              />
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

export default CrearCliente;
