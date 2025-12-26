// actions/seedData.js

import dbconnect from '@/db/dbconnect';
import Product from '@/model/ProductModel';
import ProductData from '@/db/db.json'


export async function GET(req) {
    try {
        await dbconnect()
        await Product.deleteMany();
        console.log('Products deleted!')
        await Product.insertMany(ProductData);
        console.log('All products added!');
     // Send success response
     return new Response(JSON.stringify({ message: 'Database seeded successfully!' }), { status: 200 });
    } catch (error) {
      console.error('Error seeding database:', error);
  
      // Send error response
      return new Response(JSON.stringify({ message: 'Failed to seed database', error: error.message }), { status: 500 });
    }
  }
  