const ensureAuthenticated = require('../Middleware/Auth');

const router =  require('express').Router();

router.get('/',ensureAuthenticated, (req, res) => {
    console.log("---- Logged in useer details ---", req.existinguser);

   res.status(200).json([
    {
        name: "Smart Phone",
        description: "This is product 1",
        price: 100,
    }, 

    {
        name: "Product 2",
        description: "This is product 2",
        price: 200,
    }
   ]);

})

module.exports = router;  