import React, { useState, useEffect } from 'react';
import { Eye, Lock, Edit as Pencil, Trash2, X } from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import AdminLayout from '../components/shared/AdminLayout';
import { useNavigate } from "react-router-dom";
import { deleteUser } from '../services/adminServices';

export default function GestionUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.users || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRedirection = (user) => {
    navigate(`/Users/Update`, { state: { user } });
  };

  const handleDelete = async (user) => {
    try {
      await deleteUser(user);
      setUsers(prev => prev.filter(u => u._id !== user._id));
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Suspendido': return 'bg-red-100 text-red-800';
      case 'Inactivo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserDetailsModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-red-600">Detalles del Usuario</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className={`inline-flex px-2 py-1 text-xs rounded-full mt-1 ${getStatusBadgeColor(user.status)}`}>
                {user.status}
              </span>
            </div>

            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('personal')}
                className={`pb-2 text-sm font-medium ${activeTab === 'personal' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`ml-4 pb-2 text-sm font-medium ${activeTab === 'activity' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              >
                Actividad
              </button>
            </div>

            {activeTab === 'personal' && (
              <div className="text-sm space-y-2">
                <p><strong>Teléfono:</strong> +34 612 345 678</p>
                <p><strong>Dirección:</strong> Calle Mayor 123, Madrid</p>
                <p><strong>Registro:</strong> 2023-06-15</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div className="text-sm space-y-2">
                <p><strong>Último acceso:</strong> {user.lastAccess}</p>
                <p><strong>Pedidos:</strong> {user.orders}</p>
                <p><strong>Total gastado:</strong> €1250.50</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-600">Gestiona los usuarios registrados</p>
        </div>
        <button
          onClick={() => navigate('/Users/Create')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Crear Usuario
        </button>
      </div>

      {error && (
        <div className="p-4 bg-indigo-100 text-indigo-700 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando usuarios...</div>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-100 text-indigo-600">
                <tr>
                  <th className="text-left px-4 py-2">Usuario</th>
                  <th className="text-left px-4 py-2">Estado</th>
                  <th className="text-left px-4 py-2">Rol</th>
                  <th className="text-left px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user =>
                    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                  )
                  .map(user => {
                    const userName = `${user.name || ''} ${user.lastName || ''}`.trim();
                    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                    const statusText = user.isActive === false ? 'Inactivo' : 'Activo';

                    return (
                      <tr key={user._id || user.id} className="border-b hover:bg-indigo-50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full text-white flex items-center justify-center text-xs font-bold">
                            {initials || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(statusText)}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.role === 100 ? 'Admin' : 'Cliente'}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button className="p-2 text-indigo-600 hover:text-indigo-800" onClick={() => handleRedirection(user)}>
                            <Pencil size={16} />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-700" onClick={() => handleDelete(user)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <UserDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </AdminLayout>
  );
}
