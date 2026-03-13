const ServicesTab = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 p-6 text-center">
        <div className="max-w-sm">
          <img src="/dashboard/service-image.png" alt="Services Illustration" className="w-32 h-32 mx-auto mb-6" />
          <p className="text-gray-600 mb-6 text-sm">
            Add services you provide to your customers and create Sale invoices for them faster.
          </p>
          <button className="bg-[var(--accent-orange)] text-white px-6 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity duration-200 shadow-sm">
            Add Your First Service
          </button>
        </div>
      </div>
    );
  };
  
  export default ServicesTab;