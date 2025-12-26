"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrderItemsDropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Header/Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left text-gray-600 hover:bg-gray-50 p-2 rounded-md transition-colors"
      >
        <Package size={18} />
        <span className="font-semibold flex-1">Order Items</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="border rounded-lg overflow-hidden mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Product Name</TableHead>
                <TableHead className="text-center">Size</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.size}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderItemsDropdown;