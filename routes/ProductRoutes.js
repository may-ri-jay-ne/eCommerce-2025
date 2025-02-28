const routerProduct = require ('express').Router()

const {createProduct, getProductById, getProducts, updateProduct, deleteProduct, changeDP} = require('../controller/productController')

const upload = require ('../helper/multer')

routerProduct.post('/catprods/:id', upload.single("photo"), createProduct);
routerProduct.get('/pro/:id', getProductById)
routerProduct.get('/product',getProducts);
routerProduct.patch('/product/:id',upload.single("photo"), changeDP);

routerProduct.put('/product/:id', updateProduct);
routerProduct.delete('/product/:id', deleteProduct);

module.exports = routerProduct 


