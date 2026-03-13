import type { NextPage } from 'next';
import Head from 'next/head';

const GoogleProfileManager: NextPage = () => {
  return (
    <>
      <Head>
        <title>Google Profile Manager</title>
        <meta name="description" content="Make your Business Visible on Google" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-medium text-gray-800">Google Profile Manager</h1>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden bg-white">
            
            {/* Left Panel */}
            <div className="bg-blue-100 p-8 md:p-16 flex flex-col justify-center items-center">
              <div className="w-full max-w-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    defaultValue="Shree Ganesh Electronics"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-full text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Make your Business Visible
              </h2>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                on Google
              </h2>
              <p className="text-gray-600 mb-8">
                Create your Google Business Profile in 2 minutes. Help customers find and contact you easily.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center">
                  <div className="bg-blue-600 rounded-full p-1 mr-3">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Make your business visible in Google Search</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-600 rounded-full p-1 mr-3">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Help nearby customers find you on Maps</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-600 rounded-full p-1 mr-3">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Show your hours, phone, and location clearly</span>
                </li>
              </ul>
              
              <button className="flex items-center justify-center w-full max-w-xs mx-auto md:mx-0 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_28dp.png" alt="Google G Logo" className="h-5 w-5 mr-3" />
                Sign in with Google
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GoogleProfileManager;