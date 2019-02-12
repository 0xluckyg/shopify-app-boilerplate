const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = "https://af6bebbc.ngrok.io";

const shopifyScopes = [
    "read_products",
    "write_products",
    "read_product_listings",
    "read_customers",
    "write_customers",
    "read_orders",
    "write_orders",
    "read_draft_orders",
    "write_draft_orders",
    "read_inventory",
    "write_inventory",
    "read_shipping",
    "write_shipping",
    "read_analytics",
    "read_marketing_events",
    "write_marketing_events",
    "read_resource_feedbacks",
    "write_resource_feedbacks",
    "read_shopify_payments_payouts",
    "unauthenticated_read_product_listings",
    "unauthenticated_write_checkouts",
    "unauthenticated_write_customers",
    // "read_all_orders", //Requires approval from Shopify Partners dashboard
    // "read_users", //Only for Shopify Plus
    // "write_users", //Only for Shopify Plus
]

function shopifyAuth(app){
    app.get('/shopify', (req, res) => {
        const shop = req.query.shop;
        const scopes = shopifyScopes.join()
        if (shop) {
          const state = nonce();
          const redirectUri = forwardingAddress + '/shopify/callback';
          const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
      
          res.cookie('state', state);
          res.redirect(installUrl);
        } else {
          return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
        }
    });
    
    app.get('/shopify/callback', (req, res) => {
        const { shop, hmac, code, state } = req.query;
        const stateCookie = cookie.parse(req.headers.cookie).state;
      
        if (state !== stateCookie) {
          return res.status(403).send('Request origin cannot be verified');
        }
      
        if (shop && hmac && code) {        
            // TODO
            // Validate request is from Shopify
            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
                'utf-8'
            );
            let hashEquals = false;
            // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
            
            try {
                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
                // timingSafeEqual will return an error if the input buffers are not the same length.
            } catch (e) {
                hashEquals = false;
            };
    
            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }
    
            res.status(200).send('HMAC validated');
    
        } else {
            res.status(400).send('Required parameters missing');
        }
    });
}

module.exports = {
    shopifyAuth
}