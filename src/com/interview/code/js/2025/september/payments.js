const express = require('express');
const router = express.Router();

const StockService = require('../../utils/StockService');
const PaymentsService = require('../services/PaymentsService');
const ProductsService = require('../services/ProductsService');

const productsService = new ProductsService();
const paymentsService = new PaymentsService();
const stockService = new StockService();

router.post('/create-checkout-session', async (request, response) => {
    const {productData} = request.body || {};

    // Validate required fields
    const required = ['id', 'name', 'price', 'quantity'];
    const missing = required.filter(
        (k) => productData?.[k] === undefined || productData[k] === null || productData[k] === ''
    );
    if (missing.length) {
        return response.status(400).json({error: 'Some fields are missing', data: missing});
    }

    // Fetch product from Stripe
    const product = await productsService.getProduct(productData.id);
    if (!product) {
        return response.status(404).json({error: "Product doesn't exist"});
    }

    // Check stock availability
    const enough = stockService.getProductAvailability(productData.id, productData.quantity);
    if (!enough) {
        return response.status(200).json({error: 'Not enough items in stock'});
    }

    // Validate price matches Stripe product default price (unit_amount in cents)
    const stripeUnitAmount = product?.default_price?.unit_amount;
    if (typeof stripeUnitAmount !== 'number' || productData.price !== stripeUnitAmount) {
        return response
            .status(400)
            .json({error: 'Invalid price in the payload. Try again.'});
    }

    // Create checkout session
    const sessionInfo = await paymentsService.createCheckoutSession(product, productData.quantity);
    if (!sessionInfo) {
        return response.status(400).json({error: 'Payment error happened. Try again.'});
    }

    return response.json(sessionInfo);
});

module.exports = router;