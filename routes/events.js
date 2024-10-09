/*
    Event Routes
    api/events
*/
const { Router } = require('express');
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEventos, eliminarEventos } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por la validacion del JWT
router.use(validarJWT);
// Obtener eventos

router.get('/', getEventos)
router.post('/', [
    check('title', 'Es obligatorio').not().isEmpty(),
    check('start', 'Fecha inicio es obligatorio').custom(isDate),
    check('end', 'fecha fin es obligatorio').custom(isDate),
    validarCampos
], crearEvento)
router.put('/:id', validarJWT, actualizarEventos)
router.delete('/:id', validarJWT, eliminarEventos)


module.exports = router;