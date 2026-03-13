import { Mail, MessageCircle, Send } from 'lucide-react';

const ShareMenu = () => {
  return (
    <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-xl border z-10">
      <div className="flex items-center gap-4">
        <button className="flex flex-col items-center text-gray-600 hover:text-red-500">
          <Mail size={24}/>
          <span className="text-xs mt-1">Email</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-green-500">
          <MessageCircle size={24}/>
          <span className="text-xs mt-1">WhatsApp</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Send size={24}/>
          <span className="text-xs mt-1">SMS</span>
        </button>
      </div>
    </div>
  );
};

export default ShareMenu;
