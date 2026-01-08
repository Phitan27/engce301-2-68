// ============================================
// CONTROLLER LAYER - Products
// ============================================

const ProductService = require('../services/product.service');

class ProductController {
    // ===== GET ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();

            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ===== GET BY ID =====
    // ⚠️ นักศึกษาเติม Error Handling
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            // TODO: จัดการ Error ให้เหมาะสม
            // ถ้า "not found" → 404
            // อื่นๆ → 500
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== CREATE =====
    // ⚠️ นักศึกษาเติมโค้ด
    static async createProduct(req, res) {
        try {
            // TODO: รับข้อมูลจาก req.body
            const productData = req.body;

            // TODO: เรียก Service
            const newProduct = await ProductService.createProduct(productData);

            // TODO: ส่ง Response (201 Created)
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            // TODO: Error handling
            if (error.message.includes('required') || error.message.includes('must')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }


    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;

            const updatedProduct = await ProductService.updateProduct(id, productData);

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else if (error.message.includes('required') || error.message.includes('must')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductService.deleteProduct(id);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== SEARCH =====
    // ✅ ให้โค้ดสมบูรณ์
    static async searchProducts(req, res) {
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({
                    success: false,
                    error: 'Search keyword is required'
                });
            }

            const products = await ProductService.searchProducts(q);

            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ProductController;