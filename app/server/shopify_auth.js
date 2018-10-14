

let shop = ""
let api_key = process.env.SHOPIFY_API_KEY
let scopes = "write_orders,read_customers"
let redirect_url = ""
let nonce = "A randomly selected value provided by your application, which is unique for each authorization request. During the OAuth callback phase, your application must check that this value matches the one you provided during authorization. This mechanism is important for the security of your application."
let option = ""

let authUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${api_key}&scope=${scopes}&redirect_uri=${redirect_uri}&state=${nonce}&grant_options[]=${option}`

'https://help.shopify.com/en/api/getting-started/authentication/oauth'