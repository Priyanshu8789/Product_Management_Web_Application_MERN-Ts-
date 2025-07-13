import express from 'express';
import upload from '../middlewares/upload.middleware';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate, upload.array('images', 5), createProduct);
router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProductById);
router.put('/:id', authenticate, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
