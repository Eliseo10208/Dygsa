// components/crearContact.tsx
'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface EditClient {
  onBack: () => void;
}

const EditClient: React.FC<EditClient> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    distrito: '',
    provincia: '',
    telefono: ''
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
      const response = await axios.post('/system/Actions/cliente/crear.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data.status === 'success') {
        onBack();  // Navigate back to the list view
      } else if (data === 'invalid') {
        console.log('Invalid data');
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
         Editar Informacion
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
               placeholder='Hola'
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

export default EditClient;
