const express = require("express");
const router = express.Router();
const Filter = require("../models/Filter");

router.post("/register-product", async (req, res) => {
    console.log(req.body);

    const newProduct = new Filter({
        id: req.body.id,
        link: req.body.link,
    });

    await newProduct.save();
    return res.status(200).json(newProduct);
});

router.get("/get-product-all", async (req, res) => {
    Filter.find({}).then( productList =>  {
        if(productList){

            return res.status(200).json({results: [...productList]});
        }
        else{
            return res.status(400).json({msg: "The products can not find"});
        }
    });
});

router.post("/get-product-sort", (req, res) => {
    Filter.find({
        link: req.body.link,
    }).collation( { locale: 'en', strength: 2 } ).sort({category: 1}).then(productSortList => {

        if(productSortList){
            return res.status(200).json({results: [...productSortList]});
        }
        else{
            return res.status(400).json({msg: "The products can not find"});
        }
    });
});

module.exports = router;
