const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Összes termék lekérése
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a termékek lekérésekor' });
    }
});

// Egy termék lekérése ID alapján
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Termék nem található' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a termék lekérésekor' });
    }
});

// Új termék hozzáadása
router.post('/', async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;

        if (!name || !price || !category || stock === undefined) {
            return res.status(400).json({ message: 'Minden mező kitöltése kötelező' });
        }

        const product = new Product({
            name,
            price,
            category,
            stock
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        res.status(500).json({ message: 'Hiba a termék hozzáadásakor' });
    }
});

// Termék módosítása
router.put('/:id', async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;

        if (!name || !price || !category || stock === undefined) {
            return res.status(400).json({ message: 'Minden mező kitöltése kötelező' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, category, stock },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Termék nem található' });
        }

        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({ message: 'Hiba a termék módosításakor' });
    }
});

// Termék törlése
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Termék nem található' });
        }

        res.json({ message: 'Termék sikeresen törölve' });

    } catch (error) {
        res.status(500).json({ message: 'Hiba a termék törlésekor' });
    }
});

module.exports = router;