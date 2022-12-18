const User = require("../models/User");
const orderSchema = require("../models/order");
const { orderSuccess } = require("../services/mailService");


const myorders=async(req,res)=>{
    try {
        const {email}=req.params;
        let orders = await orderSchema.find({email:email}); 
          res.render("myorders",{orders:orders,header:"header.css",title:"My Orders"});
    } catch (error) {
        console.log(error);
    }
};

const checkOut=(req,res)=>{
    // const amount=req.query.amount;
    const amount=req.session.totalPrice;
    return res.render('checkout',{amount:amount,header:"header.css",title:"Checkout"})
}

const orderHandler=async(req,res)=>{
    try {
        let email=req.session.email;
        let data = await User.findOne({email:email});
      //  console.log(data);
        if(data.status==1){
            let amount=req.session.totalPrice;
            orderSuccess(amount,data);
            let orderdata= req.session.cart;
            let Orderplaced = {email,amount, pizzas :orderdata};
            const order = new orderSchema(Orderplaced);
            try {
                await order.save();
            } catch (error) {
                console.log(error);
            }
            delete req.session.cart;
            return res.render('order',{succs:'You will recieve notification by email with order details',title:"Checkout"})
        }
        else{
            return res.render('order',{error:'Please Verify Your Email First',header:"header.css",title:"Checkout"})
        }

    } catch (error) {
        console.log(error);
    }
}



module.exports={
    checkOut,
    orderHandler,
    myorders
}