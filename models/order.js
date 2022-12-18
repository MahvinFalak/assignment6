const mongoose = require('mongoose');
const orderSchema=mongoose.Schema({
    // p_id:{
    //     type : String,
    //     required:true,
    // },
    email:{
        type : String,
        required:true
    },
    amount:{
        type : Number,
        required:true
    },
    pizzas : {}
})

module.exports=mongoose.model("order",orderSchema);