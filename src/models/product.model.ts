// src/models/product.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '../types/product.interface';

export interface IProductModel extends IProduct, Document {}

const productSchema = new Schema<IProductModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    deliveryInfo: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProductModel>('Product', productSchema);
export default Product;
