const categoryRouter = require('express').Router()
const { createCategory, getCategory, updateCategory } = require('../controller/categoryController')
const { checkRole} = require('../middleware/authorization')

categoryRouter.post('/createcat', checkRole, createCategory);
categoryRouter.get('/getcat', getCategory);
categoryRouter.put('/update/:id', checkRole, updateCategory);



module.exports = categoryRouter

