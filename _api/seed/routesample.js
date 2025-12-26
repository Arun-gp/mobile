// actions/seedData.js

import dbconnect from '@/db/dbconnect';
import Product from '@/model/ProductModel';
import ProductData from '@/db/db.json'


const seedProducts = async ()=>{
    try{
        await dbconnect()
        await Product.deleteMany();
        console.log('Products deleted!')
        await Product.insertMany(ProductData);
        console.log('All products added!');
    }catch(error){
        console.log(error.message);
    }   
}

seedProducts();