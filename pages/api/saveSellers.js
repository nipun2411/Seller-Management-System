import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
 if (req.method === 'POST') {
   const sellers = req.body;
   const jsonFilePath = path.join(process.cwd(), 'data', 'SellerDump.json');
   
   try {
     const jsonData = JSON.stringify(sellers, null, 2);
     fs.writeFileSync(jsonFilePath, jsonData, 'utf-8');
     
     res.status(200).json({ message: 'Sellers saved successfully' });
   } catch (error) {
     console.error('Error saving sellers:', error);
     res.status(500).json({ message: 'Error saving sellers', error: error.message });
   }
 } else {
   res.status(405).json({ message: 'Method not allowed' });
 }
}