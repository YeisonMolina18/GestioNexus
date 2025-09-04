import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import Swal from 'sweetalert2';

const Header = ({ searchTerm, setSearchTerm }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados para controlar la visibilidad de los menús desplegables
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Referencias a los elementos del DOM para detectar clics fuera de ellos
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Efecto para cerrar los menús si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres cerrar la sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16A34A',
            cancelButtonColor: '#5D1227',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
            }
        });
    };

    return (
        <header className="flex items-center justify-between">
            {/* Saludo al usuario */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo, {user?.name ? user.name.split(' ')[0] : ''}!</h1>
                <p className="text-gray-500">Aquí tienes el resumen de tu negocio.</p>
            </div>

            {/* Buscador y Acciones del Header */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="w-64 pl-10 pr-4 py-2 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#5D1227]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                </div>
                
                {/* Contenedor del Icono de Notificaciones */}
                <div className="relative" ref={notifRef}>
                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-gray-600 hover:text-[#5D1227]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </button>
                    <NotificationDropdown isOpen={notifOpen} />
                </div>

                {/* Contenedor del Icono de Perfil de Usuario */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => setProfileOpen(!profileOpen)} className="w-10 h-10 bg-[#5D1227] rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                        {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                    </button>
                    {/* Menú desplegable del Perfil */}
                    {profileOpen && (
                        <div className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-xl border z-50 py-1">
                            <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;