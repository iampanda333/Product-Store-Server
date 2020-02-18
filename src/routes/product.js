const express = require('express');
const Product = require('../models/product');
const middleware = require('../middleware/helper');

const router = new express.Router();

router.get('/products', middleware.allowIfLoggedin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.send({ success: true, data: products });
    } catch (e) {
        res.status(500).send({ success: false });
    }

})

router.get('/products/:id', middleware.allowIfLoggedin, async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Task.findById(_id);
        if (!product) {
            return res.status(404).send({ success: false });
        }
        res.send({ success: true, data: product });
    } catch (e) {
        res.send(500).send({ success: false });
    }
})

router.post('/products', middleware.allowIfLoggedin, async (req, res) => {
    const product = new Product({ ...req.body });
    try {
        await product.save();
        res.status(201).send({ success: true, data: product });
    } catch (e) {
        res.status(400).send({ success: false, error: e })
    }
})

router.patch('/products/:id', middleware.allowIfLoggedin, async (req, res) => {
    const user = res.locals.loggedInUser;
    if (user.isAdmin) {
        const allowedUpdates = ['display'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((u) => allowedUpdates.includes(u));

        if (!isValidOperation) {
            return res.status(400).send({ success: false, error: 'Invalid updates' });
        }

        try {
            const product = await Product.findOne({ _id: req.params.id });
            if (!product) {
                return res.status(404).send({ success: false });
            }
            updates.forEach((u) => product[u] = req.body[u]);
            await product.save();
            res.send({ success: true, data: product });
        } catch (e) {
            res.status(500).send({ success: false });
        }
    } else {
        res.status(401).send({ success: false, error: 'Unauthorized access' });
    }
})

router.delete('/products/:id', middleware.allowIfLoggedin, async (req, res) => {
    const user = res.locals.loggedInUser;
    console.log(user);
    if (user.isAdmin) {
        const _id = req.params.id;
        try {
            const product = await Product.findByIdAndDelete({ _id });
            if (!product) {
                return res.status(404).send({ success: false });
            }
            res.send({ success: true });
        } catch (e) {
            res.status(500).send({ success: false });
        }
    } else {
        res.status(401).send({ success: false, error: 'Unauthorized access' });
    }
})


module.exports = router;

