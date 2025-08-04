'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/molecules/Card';

const data = [
  { name: 'Jan', spent: 4000 },
  { name: 'Feb', spent: 3000 },
  { name: 'Mar', spent: 2000 },
  { name: 'Apr', spent: 2780 },
  { name: 'May', spent: 1890 },
  { name: 'Jun', spent: 2390 },
  { name: 'Jul', spent: 3490 },
];

export default function SpendingTrendsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Spending Trends</h1>
          <p className="mt-2 text-gray-600">Visualize your spending over time.</p>
        </motion.div>

        <Card className="mt-8">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="spent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}