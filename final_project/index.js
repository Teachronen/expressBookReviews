const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // 1. Check if the session exists
    if(req.session.authorization) {
        
        // 2. Get the token stored in the session
        let token = req.session.authorization['accessToken'];

        // 3. Verify the token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Token is valid: Let the user pass
                req.user = user;
                next();
            } else {
                // Token is invalid: Block access
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        // No session found: Block access
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
