const { Router } = require('express');
const profissionaisController = require('../controllers/profissionais.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', profissionaisController.listar);
router.post('/', authMiddleware, profissionaisController.criar);
router.put('/:id', authMiddleware, profissionaisController.atualizar);
router.delete('/:id', authMiddleware, profissionaisController.deletar);

module.exports = router;
