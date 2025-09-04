const { Router } = require('express');
const { check, body } = require('express-validator');
const multer = require('multer');
const { getUsers, createUser, updateUser, deleteUser, activateUser, updatePassword, uploadProfilePhoto } = require('../controllers/users.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// Configuración de Multer para guardar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Aplica el middleware de JWT a todas las rutas de usuarios
router.use(validateJWT);

// Ruta para subir la foto de perfil
router.post('/upload-photo', upload.single('profile_photo'), uploadProfilePhoto);

// --- Resto de las rutas ---
const passwordValidationMsg = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.';
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/;

router.put('/update-password', [
    check('oldPassword', 'La contraseña actual es obligatoria').not().isEmpty(),
    check('newPassword').matches(passwordRegex).withMessage(passwordValidationMsg),
    validateFields
], updatePassword);

router.get('/', isAdminRole, getUsers);
router.post('/', [isAdminRole, check('full_name').not().isEmpty(), check('username').not().isEmpty(), check('email').isEmail(), check('role_id').isInt(), check('password').matches(passwordRegex).withMessage(passwordValidationMsg), validateFields], createUser);
router.put('/activate/:id', isAdminRole, activateUser);
router.put('/:id', [isAdminRole, body('password').if(body('password').exists({ checkFalsy: true })).matches(passwordRegex).withMessage(passwordValidationMsg), validateFields], updateUser);
router.delete('/:id', isAdminRole, deleteUser);

module.exports = router;