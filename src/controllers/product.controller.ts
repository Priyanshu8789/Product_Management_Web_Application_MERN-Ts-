// File: src/controllers/product.controller.ts
import { Request, Response } from 'express';
import Product from '../models/product.model';
import HttpStatus  from '../utils/constants/httpStatus';
import Messages from '../utils/constants/messages';
import { IProduct } from '../types/product.interface';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { paginate, IPaginationOptions } from '../utils/pagination';
import { buildFilter } from '../utils/queryHelper';


// Create
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, deliveryInfo } = req.body;
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return errorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        '⚠️ No images uploaded or field name mismatch'
      );
    }

    const images = (req.files as Express.Multer.File[]).map(file => file.path);

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      deliveryInfo,
      images,
    });

    return successResponse(
      res,
      HttpStatus.CREATED,
      newProduct,
      Messages.Products.Created
    );
  } catch (err) {
    return errorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      Messages.Products.CreationFailed,
      err,
      req
    );
  }
};

// Get all (with search, filter, pagination)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 10;
    const options: IPaginationOptions = { page, limit };

    const filter = buildFilter<IProduct>(req.query, [
      'title',
      'description',
      'category',
    ]);

    let query = Product.find(filter);
    query = paginate(query, options);
    const products = await query.exec();

    return successResponse(
      res,
      HttpStatus.OK,
      products,
      Messages.Products.Fetched
    );
  } catch (err) {
    return errorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      Messages.Products.FetchFailed,
      err,
      req 
    );
  }
};

// Get one
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(
        res,
        HttpStatus.NOT_FOUND,
        Messages.Products.FetchOneFailed
      );
    }
    return successResponse(
      res,
      HttpStatus.OK,
      product,
      Messages.Products.FetchedOne
    );
  } catch (err) {
    return errorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      Messages.Products.FetchOneFailed,
      err,
      req
    );
  }
};

// Update
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, deliveryInfo } = req.body;
    const updateData: Partial<IProduct> = {
      title,
      description,
      price,
      category,
      deliveryInfo,
    };

    if (req.files) {
      const images: string[] = [];
      if (Array.isArray(req.files)) {
        images.push(...req.files.map(f => (f as any).path));
      } else {
        Object.values(req.files).forEach(arr =>
          images.push(...(arr as any[]).map(f => f.path))
        );
      }
      updateData.images = images;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) {
      return errorResponse(
        res,
        HttpStatus.NOT_FOUND,
        Messages.Products.UpdateFailed
      );
    }
    return successResponse(
      res,
      HttpStatus.OK,
      updated,
      Messages.Products.Updated
    );
  } catch (err) {
    return errorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      Messages.Products.UpdateFailed,
      err,
      req
    );
  }
};

// Delete
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return errorResponse(
        res,
        HttpStatus.NOT_FOUND,
        Messages.Products.DeleteFailed
      );
    }
    return successResponse(
      res,
      HttpStatus.OK,
      null,
      Messages.Products.Deleted
    );
  } catch (err) {
    return errorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      Messages.Products.DeleteFailed,
      err,
      req
    );
  }
};
