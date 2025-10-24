const Stripe = require('stripe');
const {STRIPE_API_KEY} = require('../settings');

class PaymentService {
    constructor() {
        this.stripe = Stripe(STRIPE_API_KEY, {timeout: 200});
    }

    async createCheckoutSession(product, quantity) {
        try {
            const priceId =
                (product && product.default_price && product.default_price.id) ||
                product.default_price;

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price: priceId,
                        quantity,
                    },
                ],
                success_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel',
            });

            return {id: session.id, url: session.url, amountTotal: session.amount_total};
        } catch (e) {
            return null; // signal failure to caller
        }
    }
}

module.exports = PaymentService;