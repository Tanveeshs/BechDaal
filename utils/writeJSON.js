const fs = require('fs')
const dotenv = require('dotenv');
dotenv.config()
let code = {
    type: "service_account",
    "project_id": process.env.project_id,
    "private_key_id": process.env.project_key,
    "private_key": process.env.private_key,
    "client_email": "bd1-789@stoked-courier-276420.iam.gserviceaccount.com",
    "client_id": "116842258893352446372",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bd1-789%40stoked-courier-276420.iam.gserviceaccount.com"
}
let data = JSON.stringify(code);
fs.writeFileSync('keys.json',data)