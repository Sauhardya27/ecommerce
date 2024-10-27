import mongoose, { Document, Schema } from 'mongoose';
import dbConnect from './db';

interface Item extends Document {
  id: number;
  name: string;
  selected: boolean;
}

const itemSchema = new Schema<Item>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  selected: { type: Boolean, default: false },
});

const ItemModel = mongoose.models.Item || mongoose.model<Item>('Item', itemSchema);

const data = [
  { id: 1, name: "Shoes", selected: false },
  { id: 2, name: "Men T-shirts", selected: false },
  { id: 3, name: "Makeup", selected: false },
  { id: 4, name: "Jewellery", selected: false },
  { id: 5, name: "Women T-shirts", selected: false },
  { id: 6, name: "Furniture", selected: false },
  { id: 7, name: "Electronics", selected: false },
  { id: 8, name: "Books", selected: false },
  { id: 9, name: "Gadgets", selected: false },
  { id: 10, name: "Sportswear", selected: false },
  { id: 11, name: "Home Decor", selected: false },
  { id: 12, name: "Toys", selected: false },
  { id: 13, name: "Kitchenware", selected: false },
  { id: 14, name: "Bags", selected: false },
  { id: 15, name: "Accessories", selected: false },
  { id: 16, name: "Pet Supplies", selected: false },
  { id: 17, name: "Fitness Equipment", selected: false },
  { id: 18, name: "Beauty Products", selected: false },
  { id: 19, name: "Travel Gear", selected: false },
  { id: 20, name: "Garden Supplies", selected: false },
  { id: 21, name: "Art Supplies", selected: false },
  { id: 22, name: "Watches", selected: false },
  { id: 23, name: "Sunglasses", selected: false },
  { id: 24, name: "Office Supplies", selected: false },
  { id: 25, name: "Stationery", selected: false },
  { id: 26, name: "Laptops", selected: false },
  { id: 27, name: "Mobile Phones", selected: false },
  { id: 28, name: "Cameras", selected: false },
  { id: 29, name: "Headphones", selected: false },
  { id: 30, name: "Speakers", selected: false },
  { id: 31, name: "Projectors", selected: false },
  { id: 32, name: "Printers", selected: false },
  { id: 33, name: "Smart Watches", selected: false },
  { id: 34, name: "Fitness Trackers", selected: false },
  { id: 35, name: "Gaming Consoles", selected: false },
  { id: 36, name: "Board Games", selected: false },
  { id: 37, name: "Puzzles", selected: false },
  { id: 38, name: "Gift Cards", selected: false },
  { id: 39, name: "Candles", selected: false },
  { id: 40, name: "Bath & Body", selected: false },
  { id: 41, name: "Perfumes", selected: false },
  { id: 42, name: "Skincare", selected: false },
  { id: 43, name: "Haircare", selected: false },
  { id: 44, name: "Health Supplements", selected: false },
  { id: 45, name: "Organic Foods", selected: false },
  { id: 46, name: "Dairy Products", selected: false },
  { id: 47, name: "Bakery Items", selected: false },
  { id: 48, name: "Frozen Foods", selected: false },
  { id: 49, name: "Soft Drinks", selected: false },
  { id: 50, name: "Energy Drinks", selected: false },
  { id: 51, name: "Juices", selected: false },
  { id: 52, name: "Snacks", selected: false },
  { id: 53, name: "Condiments", selected: false },
  { id: 54, name: "Spices", selected: false },
  { id: 55, name: "Grains", selected: false },
  { id: 56, name: "Vegetables", selected: false },
  { id: 57, name: "Fruits", selected: false },
  { id: 58, name: "Meat & Poultry", selected: false },
  { id: 59, name: "Seafood", selected: false },
  { id: 60, name: "Cereals", selected: false },
];

async function seedItems() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB successfully!');

    await ItemModel.deleteMany({});
    console.log('Cleared existing items');

    await ItemModel.insertMany(data);
    console.log('Successfully seeded items');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedItems();