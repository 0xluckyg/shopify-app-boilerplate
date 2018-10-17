// Shopify Partners Login
// https://partners.shopify.com
// OAuth Doc
// https://help.shopify.com/en/api/getting-started/authentication/oauth
// Shopify Permissions Scope
// https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
// For development use ngrok tunnelling ~/ngrok http 3000

const crypto = require("crypto");
const shopifyScopes = [
    "read_products",
    "write_products",
    "read_product_listings",
    "read_customers",
    "write_customers",
    "read_orders",
    "write_orders",
    // "read_all_orders", //Requires approval from Shopify Partners dashboard
    "read_draft_orders",
    "write_draft_orders",
    "read_inventory",
    "write_inventory",
    "read_shipping",
    "write_shipping",
    "read_analytics",
    "read_users",
    "write_users",
    "read_marketing_events",
    "write_marketing_events",
    "read_resource_feedbacks",
    "write_resource_feedbacks",
    "read_shopify_payments_payouts",
    "unauthenticated_read_product_listings",
    "unauthenticated_write_checkouts",
    "unauthenticated_write_customers"
]
let host = "https://ed0a844c.ngrok.io"

function shopifyOAuthRequest(storeName, res) {
    let api_key = process.env.SHOPIFY_API_KEY
    let scopes = shopifyScopes.join()
    let redirect_uri = host + "/shopify/add_shopify"
    const nonce = crypto.randomBytes(16).toString("hex")

    let authUrl = `https://${storeName}.myshopify.com/admin/oauth/authorize?
                    client_id=${api_key}
                    &scope=${scopes}
                    &redirect_uri=${redirect_uri}
                    &state=${nonce}`

    res.redirect(authUrl)
}

function securityCheck(storeName) {
    
}

function saveStore() {

}

function addShopify(app) {
    app.get('/shopify/add_shopify', (req, res) => {
        securityCheck('')
    })

    app.post('/shopify/add_shopify', (req, res) => {
        shopifyOAuthRequest(req.body.storeName, res)
    })
}

module.exports = {
    addShopify
}