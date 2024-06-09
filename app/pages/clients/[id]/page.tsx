'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

interface EditClientProps {
  onBack: () => void;
}

const EditClient: React.FC<EditClientProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    distrito: '',
    provincia: '',
    telefono: ''
  });

  const router = useRouter();
  const { id } = useParams(); // Assuming you use the `useParams` hook to get the dynamic ID from the URL

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`/api/auth/clients/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/auth/clients/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.status === 'success') {
        alert('Datos actualizados con éxito');
        router.push('/clients'); // Navigate back to the list view
      } else {
        console.log('Error updating data:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={onBack}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Editar Información
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
              <div className="label">Teléfono</div>
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
