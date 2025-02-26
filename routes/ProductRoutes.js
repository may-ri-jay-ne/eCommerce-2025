const router = require ('express').Router()

const {createProduct, getallproduct, getOneProduct, updateProduct, deleteProduct, changeDP} = require('../controller/ProductController')
const upload = require ('../helper/multer')
router.post('/product', upload.single("photo"), createProduct);
router.post('/product', createProduct); 
router.patch('/product/:id',upload.single("photo"), changeDP);
router.get('/product',getallproduct);
router.get('/products/:id',getOneProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

module.exports = router 