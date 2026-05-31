const { Router } = require('express');
const agendamentosController = require('../controllers/agendamentos.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', authMiddleware, agendamentosController.listar);
router.post('/', agendamentosController.criar);
router.put('/:id', authMiddleware, agendamentosController.atualizar);
router.delete('/:id', authMiddleware, agendamentosController.deletar);

module.exports = router;
