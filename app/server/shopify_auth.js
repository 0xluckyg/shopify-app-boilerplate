// Shopify Partners Login
// https://partners.shopify.com
// OAuth Doc
// https://help.shopify.com/en/api/getting-started/authentication/oauth
// Shopify Permissions Scope
// https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
// For development use ngrok tunnelling ~/ngrok http 3000

const crypto = require("crypto");
const url = require('url');
const verify = require('../tools/verify');
const request = require('request');

const shopifyScopes = [
    "",
    "",
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
let host = "https://2e6e7a48.ngrok.io"

function shopifyOAuthRequest(req, res) {    
    let storeName = req.body.storeName
    let api_key = process.env.SHOPIFY_API_KEY
    let scopes = shopifyScopes.join()
    let redirect_uri = host + "/shopify/add_shopify"
    const nonce = crypto.randomBytes(16).toString("hex")

    let authUrl = `https://${storeName}.myshopify.com/admin/oauth/authorize?client_id=${api_key}&scope=${scopes}&redirect_uri=${redirect_uri}&state=${nonce}`

    console.log('authURL: ',authUrl)
    res.cookie('state', nonce);
    res.redirect(authUrl)  

}

function securityCheck(req, res) {
    let regexFlag = false;
    let securityFlag = false;
    let shop = req.query.shop;
    let code = req.query.code;
    const regex = /^[a-z\d_.-]+[.]myshopify[.]com$/;

    if (shop.match(regex)) {
        console.log('regex matches');
        regexFlag = true
    } else {
        regexFlag = false        
    }

    // 1. Parse the string URL to object
    let urlObj = url.parse(req.url);
    // 2. Get the 'query string' portion
    let query = urlObj.search.slice(1);
    if (verify.verify(query)) {
        //get token
        console.log('get token');
        securityPass = true;
    } else {        
        securityPass = false;        
    }

    if (securityPass && regex) {
        //Exchange temporary code for a permanent access token
        let accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        let accessTokenPayload = {
            client_id: appId,
            client_secret: appSecret,
            code,
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                let accessToken = accessTokenResponse.access_token;
                console.log('shop token ' + accessToken);                
                //send acceptance
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
    } else {
        //send error
    }
}

function saveStore() { 

}

function deleteStore() {

}

function addShopify(app) {    
    app.get('/shopify/add_shopify', (req, res) => {        
        securityCheck(req, res)        
    })

    app.post('/shopify/add_shopify', (req, res) => {
        shopifyOAuthRequest(req, res)
    })
}

function removeShopify(app) {
    
}

module.exports = {
    addShopify,
    removeShopify
}