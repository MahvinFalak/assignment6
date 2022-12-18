const express=require('express');
const { cartHandler, cartView, cartUpdateHandler  } = require('../controllers/cartController');
const { checkOut, orderHandler ,myorders} = require('../controllers/checkoutController');
const { getAllPizza} = require('../controllers/productDetailsController');
const { signupView, loginView, registerUser, login, logout, defaultPage, activateAccount, profileHandler , showupdateuser ,updateuser , deleteuser} = require('../controllers/userController');

const router=express.Router();

// GET ROUTES HERE
router.get('/',defaultPage)
router.get('/regis',signupView);
router.get("/activateaccount/:id",activateAccount);
router.get('/login',loginView);
router.get('/menu',getAllPizza);
router.get('/logout',logout);


router.get('/cart',cartView);
router.get('/cart/:id',cartHandler);
router.get('/updatecart/:name',cartUpdateHandler);
router.get('/checkout',checkOut);

router.get('/profile',profileHandler);
router.get("/myorders/:email",myorders);
router.get("/updateuser/:id",showupdateuser);
router.get("/deleteuser/:id",deleteuser);
// POST Routes Here
router.post('/regis',registerUser);
router.post('/login',login);
router.post('/cart/:id',cartHandler)
router.post('/chekouthandle',orderHandler);
router.post("/updateuser/:id",updateuser);

module.exports=router;