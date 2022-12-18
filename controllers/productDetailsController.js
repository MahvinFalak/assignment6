const mongoose = require('mongoose');
const express = require('express');
const pizzaSchema = require('../models/PizzaDetail');
const router = require('../routes/route');

const getAllPizza = async (req, res) => {
    try {
        if (req.session.username) {
            let data = await pizzaSchema.find({})
            res.render('menu', { data: data.map(data => data.toJSON()),header:"header.css",title:"Menu" })
        }
        else {
            res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllPizza
}