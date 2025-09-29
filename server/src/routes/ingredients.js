const r = require('express').Router();
const ctrl = require('../controllers/ingredientController');
const auth = require('../middleware/authMiddleware');

r.get('/', auth(), ctrl.list); 
r.post('/', auth(), ctrl.request); 
r.put('/:id', auth(['admin']), ctrl.update); 
r.delete('/:id', auth(['admin']), ctrl.delete);

module.exports = r;
