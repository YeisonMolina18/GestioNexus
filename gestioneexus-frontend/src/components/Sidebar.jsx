import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

// --- INICIO DE LAS DEFINICIONES DE ICONOS COMPLETAS ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const VentasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H7.118l-.38-1.516A1 1 0 005.74.5H3zM6.38 6h7.392l-2.25 4.5H8.518L6.38 6z" /><path d="M10 18a2 2 0 11-4 0 2 2 0 014 0zM18 18a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ProductosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
const PlanSepareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 8v10a2 2 0 002 2h6a2 2 0 002-2V8H5z" /></svg>;
const ReportesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
const ProveedoresIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const AuditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
// --- FIN DE LAS DEFINICIONES DE ICONOS ---

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?', text: "¿Quieres cerrar la sesión?", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#16A34A', cancelButtonColor: '#5D1227',
            confirmButtonText: 'Sí, cerrar sesión', cancelButtonText: 'Cancelar'
        }).then((result) => { if (result.isConfirmed) { logout(); navigate('/login'); } });
    };
    
    const linkStyles = "flex items-center w-full text-left px-6 py-3 rounded-r-full transition-colors";
    const activeLinkStyles = "bg-yellow-400 text-[#5D1227] font-bold";
    const inactiveLinkStyles = "text-white hover:bg-white hover:bg-opacity-20";

    const getLinkClass = ({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`;

    return (
        <div className="w-64 bg-[#5D1227] text-white flex flex-col h-full shadow-lg flex-shrink-0">
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-500">Logo</div>
                <h2 className="text-xl font-bold">Variedades Cinthya</h2>
            </div>
            <div className="p-4 text-center border-y border-white border-opacity-20">
                <p className="text-sm">BIENVENIDO</p>
                <p className="font-semibold text-lg">{user?.name || 'Usuario'}</p>
            </div>
            <nav className="flex-1 mt-6 space-y-2">
                <NavLink to="/dashboard" className={getLinkClass}><DashboardIcon /> Dashboard</NavLink>
                
                {/* Enlaces para Todos los Usuarios Logueados */}
                <NavLink to="/sales" className={getLinkClass}><VentasIcon /> Ventas</NavLink>
                <NavLink to="/products" className={getLinkClass}><ProductosIcon /> Productos</NavLink>
                <NavLink to="/layaway" className={getLinkClass}><PlanSepareIcon /> Plan separe</NavLink>

                {/* Enlaces Exclusivos para Administradores */}
                {user?.role === 'admin' && (
                    <>
                        <hr className="border-white border-opacity-20 my-4" />
                        <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</h3>
                        <NavLink to="/employees" className={getLinkClass}><UserIcon /> Empleados</NavLink>
                        <NavLink to="/sales-history" className={getLinkClass}><HistoryIcon /> Historial de Ventas</NavLink>
                        <NavLink to="/reports" className={getLinkClass}><ReportesIcon /> Reportes</NavLink>
                        <NavLink to="/suppliers" className={getLinkClass}><ProveedoresIcon /> Proveedores</NavLink>
                        <NavLink to="/audit-log" className={getLinkClass}><AuditIcon /> Auditoría</NavLink>
                    </>
                )}
            </nav>
            <div className="p-4 border-t border-white border-opacity-20 mt-auto">
                <button onClick={handleLogout} className="w-full bg-[#A32E4D] py-2 rounded-lg font-bold hover:bg-[#86253F] transition-colors">
                    [→ Salir
                </button>
            </div>
        </div>
    );
};

export default Sidebar;