// src/components/ActionsMenu.tsx
const ActionsMenu = () => {
    const menuItems = [
      'View/Edit', 'Generate e-Invoice', 'Receive Payment', 'Convert To Return',
      'Preview Delivery Challan', 'Cancel Invoice', 'Delete', 'Duplicate',
      'Open PDF', 'Preview', 'Print', 'View History'
    ];
  
    return (
      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-10">
        <ul className="p-1 text-sm text-gray-700">
          {menuItems.map(item => (
            <li key={item}>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  export default ActionsMenu;