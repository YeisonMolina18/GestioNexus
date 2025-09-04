// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Comprobar si hay un token en localStorage al cargar la app
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser({
                    id: decodedUser.uid,
                    name: decodedUser.name,
                    role: decodedUser.role
                });
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // --- AÑADE ESTA LÍNEA AQUÍ ---
        console.log('FRONTEND: Intentando iniciar sesión con:', { email: email, password: password });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            const decodedUser = jwtDecode(data.token);
            setUser({
                id: decodedUser.uid,
                name: data.user.fullName, // Usamos el nombre completo devuelto por el login
                role: decodedUser.role
            });
            return true;
        } catch (error) {
            console.error("Error en el login:", error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error en el inicio de sesión',
                text: error.response?.data?.msg || 'Credenciales incorrectas.',
                confirmButtonColor: '#5D1227'
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};