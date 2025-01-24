import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const jsonFilePath = path.join(process.cwd(), 'data', 'SellerDump.json');
    
    try {
      const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
      const parsedData = JSON.parse(jsonData);
      res.status(200).json(parsedData);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      res.status(500).json({ message: 'Error reading file', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}