'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

interface EditarAdminUserProps {
  onBack: () => void;
}

const EditarAdminUser: React.FC<EditarAdminUserProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    rol: 'user',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/auth/adminuser/${userId}`);
        setFormData({
          name: response.data.name,
          lastname: response.data.lastname,
          email: response.data.email,
          password: '', // No traer la contraseña actual por seguridad
          rol: response.data.rol,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/auth/adminuser/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data) {
        Swal.fire('Éxito', 'Usuario administrador modificado con éxito', 'success');
        router.push('/pages/administracion');  // Navega de vuelta a la vista de lista
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un error al modificar el usuario', 'error');
    }
  };

  return (
    <div className="panel">
      <button className="back_btn" onClick={() => router.push('/pages/administracion')}>
        Regresar
      </button>
      <div className="panel-header">
        <div className="title">
          Editar usuario administrador
          <p>Administración de usuarios</p>
        </div>
      </div>
      <form className="form_s editar_adminuser" onSubmit={handleSubmit}>
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
                placeholder="Dejar en blanco para no cambiar"
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
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarAdminUser;
