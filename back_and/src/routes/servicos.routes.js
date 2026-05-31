const { Router } = require('express');
const servicosController = require('../controllers/servicos.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', servicosController.listar);
router.get('/profissional/:profissionalId', servicosController.listarPorProfissional);
router.get('/meus', authMiddleware, servicosController.listarMeus);
router.post('/', authMiddleware, servicosController.criar);
router.put('/:id', authMiddleware, servicosController.atualizar);
router.delete('/:id', authMiddleware, servicosController.deletar);

module.exports = router;
