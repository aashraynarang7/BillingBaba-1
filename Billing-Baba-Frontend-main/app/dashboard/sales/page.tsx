"use client"
import { Suspense } from 'react';
import SalesPageContent from './SalesPageContent';

const SalesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesPageContent />
    </Suspense>
  );
};

export default SalesPage;
