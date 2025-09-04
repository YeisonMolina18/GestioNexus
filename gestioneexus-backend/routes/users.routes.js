const { Router } = require('express');
const { check } = require('express-validator');
const { 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    activateUser, 
    updatePassword 
} = require('../controllers/users.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();
router.use(validateJWT);

const passwordValidationMsg = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.';
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/;

// --- ORDEN DE RUTAS CORREGIDO ---

// 1. Rutas específicas (sin parámetros dinámicos en medio) van primero.
router.put('/update-password', [
    check('oldPassword', 'La contraseña actual es obligatoria').not().isEmpty(),
    check('newPassword').matches(passwordRegex).withMessage(passwordValidationMsg),
    validateFields
], updatePassword);

router.get('/', isAdminRole, getUsers);

router.post('/', [
    isAdminRole,
    check('full_name', 'El nombre es obligatorio').not().isEmpty(),
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('role_id', 'El rol es obligatorio').isInt(),
    check('password').matches(passwordRegex).withMessage(passwordValidationMsg),
    validateFields
], createUser);

// 2. Rutas que tienen un parámetro pero son más específicas que la ruta general de edición.
router.put('/activate/:id', isAdminRole, activateUser);

// 3. Rutas generales con parámetros van al final para no "capturar" las peticiones de las de arriba.
router.put('/:id', isAdminRole, updateUser);
router.delete('/:id', isAdminRole, deleteUser);

module.exports = router;