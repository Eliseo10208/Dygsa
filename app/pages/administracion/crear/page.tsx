'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface CrearAdminUserProps {
  onBack: () => void;
}

const CrearAdminUser: React.FC<CrearAdminUserProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    rol: 'user',
    registerdate: new Date().toISOString(), // Initialize with current date
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/adminuser', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (response.status === 200) {
        Swal.fire('Éxito', 'Usuario administrador creado con éxito', 'success');
        router.push('/pages/administracion');  // Navega de vuelta a la vista de lista
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un error al crear el usuario', 'error');
    }
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => router.push('/pages/administracion')}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Agregar un nuevo usuario administrador
          <p>Administración de usuarios</p>
        </div>
      </div>
      <form className="form_s crear_adminuser" onSubmit={handleSubmit}>
        <div className="row justify-content-md-center">
          <div className="col-md-8">
            <div className="group">
              <div className="label">Nombre</div>
              <input
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Apellido</div>
              <input
                name="lastname"
                type="text"
                className="form-control"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Email</div>
              <input
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Contraseña</div>
              <input
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="label">Rol</div>
              <select
                name="rol"
                className="form-control"
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
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

export default CrearAdminUser;
