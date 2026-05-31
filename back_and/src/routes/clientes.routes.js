const { Router } = require('express');
const clientesController = require('../controllers/clientes.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', clientesController.listar);
router.get('/email/:email', clientesController.buscarPorEmail);
router.post('/', clientesController.criar);
router.put('/:id', clientesController.atualizar);
router.delete('/:id', authMiddleware, clientesController.deletar);

module.exports = router;
