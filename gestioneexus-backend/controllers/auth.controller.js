// /controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../db/database');
const { generateJWT } = require('../helpers/jwt');
const { sendPasswordResetEmail } = require('../helpers/email.helper');
const { logAction } = require('../helpers/audit.helper'); // <-- 1. IMPORTACIÓN AÑADIDA

const login = async (req, res) => {
    // Ya no necesitamos este console.log, lo podemos quitar para limpiar la terminal
    // console.log('BACKEND: Se recibió en req.body:', req.body); 
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const [rows] = await pool.query('SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        if (!user.is_active) {
            return res.status(400).json({ msg: 'El usuario está desactivado' });
        }

        // Verificar la contraseña usando .trim() para eliminar espacios invisibles
        const validPassword = bcrypt.compareSync(password.trim(), user.password.trim());

        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        // Generar el JWT
        const token = await generateJWT(user.id, user.full_name, user.role_name); // Usar full_name para que se muestre en el sidebar

        res.json({
            ok: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role_name
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const renewToken = async (req, res) => {
    const { uid, name, role } = req;

    const token = await generateJWT(uid, name, role);

    // Obtener la información más reciente del usuario
    const [rows] = await pool.query('SELECT u.full_name, u.username, u.email, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?', [uid]);
    const user = rows[0];

    res.json({
        ok: true,
        token,
        user: { 
            id: uid, 
            fullName: user.full_name, // Devolver nombre completo
            username: user.username,
            email: user.email,
            role: user.role_name
        }
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.json({ msg: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [token, expires, user.id]
        );

        await sendPasswordResetEmail(user.email, token);

        res.json({ msg: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]
        );
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ msg: 'El token de recuperación es inválido o ha expirado.' });
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        await pool.query(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );
        
        await logAction(user.id, `Restableció su contraseña`);

        res.json({ msg: 'Tu contraseña ha sido actualizada exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al restablecer la contraseña' });
    }
};

// --- 2. SE HA ELIMINADO EL module.exports DUPLICADO ---
module.exports = {
    login,
    renewToken,
    forgotPassword,
    resetPassword
};