const Stripe = require('stripe');
const {STRIPE_API_KEY} = require('../settings');

class ProductsService {
    constructor() {
        this.stripe = Stripe(STRIPE_API_KEY, {timeout: 200});
    }

    async getProduct(productId) {
        try {
            // Get product and expand default_price into a full Price object
            const product = await this.stripe.products.retrieve(productId, {
                expand: ['default_price'],
            });
            return product || null;
        } catch (err) {
            // Treat missing/non-existing product as null
            return null;
        }
    }
}

module.exports = ProductsService;