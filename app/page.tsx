'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, CheckCircle2, Pencil, Trash, Plus } from 'lucide-react';
import Papa from 'papaparse';

const SellerManagement = () => {
  interface Seller {
    id: number;
    name: string;
    gstNumber: string;
    address: string;
  }
  
  const [sellers, setSellers] = useState<any>([]);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [newSeller, setNewSeller] = useState({
    name: '',
    gstNumber: '',
    address: ''
  });

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/readSellers');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Fetched sellers:', data);
        setSellers(data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };
    fetchSellers();
  }, []);

  const validateGST = (gstNumber: string) => {
    const gstRegex = /^\d{2}[A-Z0-9]{13}$/;
    return gstRegex.test(gstNumber);
  };

  const saveSellersToCSV = async (sellers: Seller[]) => {
    const response = await fetch('/api/saveSellers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sellers),
    });

    if (!response.ok) {
      alert('Failed to save sellers');
    }
  };

  const handleAddSeller = () => {
    if (!newSeller.name || !newSeller.gstNumber) {
      alert('Name and GST number are required');
      return;
    }

    const newId = sellers.length > 0 ? Math.max(...sellers.map((s: Seller) => s.id)) + 1 : 1;
    const updatedSellers = [...sellers, { ...newSeller, id: newId }];
    setSellers(updatedSellers);
    setNewSeller({ name: '', gstNumber: '', address: '' });
    saveSellersToCSV(updatedSellers);
  };

  const handleUpdateSeller = () => {
    if (!editingSeller) return;

    const updatedSellers = sellers.map(seller => 
      seller.id === editingSeller.id ? editingSeller : seller
    );  
    setSellers(updatedSellers);
    setEditingSeller(null);
    saveSellersToCSV(updatedSellers);
  };

  const handleDeleteSeller = (id: number) => {
    const updatedSellers = sellers.filter((seller: Seller) => seller.id !== id);
    setSellers(updatedSellers);
    saveSellersToCSV(updatedSellers);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seller Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Name"
                value={editingSeller?.name || newSeller.name}
                onChange={(e) => editingSeller 
                  ? setEditingSeller({...editingSeller, name: e.target.value})
                  : setNewSeller({...newSeller, name: e.target.value})
                }
              />
            </div>
            <div>
              <Input
                placeholder="GST Number"
                value={editingSeller?.gstNumber || newSeller.gstNumber}
                onChange={(e) => editingSeller
                  ? setEditingSeller({...editingSeller, gstNumber: e.target.value.toUpperCase()})
                  : setNewSeller({...newSeller, gstNumber: e.target.value.toUpperCase()})
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 99XXXXX9999X9X9 (15 chars, starts with 2 digits)
              </p>
            </div>
            <div>
              <Input
                placeholder="Address"
                value={editingSeller?.address || newSeller.address}
                onChange={(e) => editingSeller
                  ? setEditingSeller({...editingSeller, address: e.target.value})
                  : setNewSeller({...newSeller, address: e.target.value})
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {editingSeller ? (
              <>
                <Button variant="outline" onClick={() => setEditingSeller(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSeller}>Update Seller</Button>
              </>
            ) : (
              <Button onClick={handleAddSeller}>Add Seller</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">
                GST Number
                <p className="font-normal text-xs text-gray-500 normal-case">
                  Format: 99XXXXX9999X9X9
                </p>
              </th>
              <th className="px-6 py-3 text-center">GST Status</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller: Seller) => (
              <tr key={seller.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{seller.name}</td>
                <td className="px-6 py-4">{seller.gstNumber}</td>
                <td className="px-6 py-4 text-center">
                  {validateGST(seller.gstNumber) ? (
                    <CheckCircle2 className="inline w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="inline w-5 h-5 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4">{seller.address}</td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSeller(seller)}
                    className="mr-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSeller(seller.id)}
                    className="text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerManagement;