import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    if (!user) {
        return <div>Cargando perfil...</div>;
    }

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Mi Perfil</h1>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-[#5D1227] rounded-full flex items-center justify-center text-white text-5xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <button className="w-full mt-2 text-sm text-blue-600 hover:underline">Cambiar foto</button>
                    </div>
                    <div className="space-y-4 flex-grow w-full">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                            <p className="text-lg text-gray-800 p-3 bg-gray-100 rounded-md">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Rol</label>
                            <p className="text-lg text-gray-800 p-3 bg-gray-100 rounded-md capitalize">{user.role}</p>
                        </div>
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Cambiar Contraseña">
                <ChangePasswordModal closeModal={() => setIsPasswordModalOpen(false)} />
            </Modal>
        </>
    );
};

export default ProfilePage;