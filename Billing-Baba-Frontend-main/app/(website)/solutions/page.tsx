import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function SolutionsPage() {
    const solutions = [
        {
            category: "Business Management System (BMS)",
            solutions: [
                {
                    name: "Accounting",
                    description: "Professional accounting made simple with comprehensive financial management",
                    href: "/solutions/bms/accounting",
                    color: "from-green-500 to-emerald-600"
                },
                {
                    name: "Inventory",
                    description: "Optimize inventory operations with real-time tracking and automation",
                    href: "/solutions/bms/inventory",
                    color: "from-orange-500 to-amber-600"
                }
            ]
        },
        {
            category: "Industry Solutions (IS)",
            solutions: [
                {
                    name: "Pharmacy",
                    description: "Streamline pharmacy operations with prescription and inventory management",
                    href: "/solutions/is/pharmacy",
                    color: "from-blue-500 to-indigo-600"
                },
                {
                    name: "Retail",
                    description: "Transform retail business with POS and customer management",
                    href: "/solutions/is/retail",
                    color: "from-purple-500 to-pink-600"
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <Breadcrumb 
                        items={[
                            { label: 'Solutions' }
                        ]} 
                    />
                    
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Our Solutions
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover comprehensive business solutions designed to streamline your operations 
                            and drive growth across different industries and business functions.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {solutions.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="space-y-6">
                                <h2 className="text-3xl font-semibold text-gray-800 text-center">
                                    {category.category}
                                </h2>
                                
                                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                    {category.solutions.map((solution, solutionIndex) => (
                                        <Link 
                                            key={solutionIndex} 
                                            href={solution.href}
                                            className="group block"
                                        >
                                            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${solution.color} mb-6 flex items-center justify-center`}>
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {solution.name}
                                                </h3>
                                                
                                                <p className="text-gray-600 mb-6 leading-relaxed">
                                                    {solution.description}
                                                </p>
                                                
                                                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                                                    Learn More
                                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Need a Custom Solution?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We can tailor our solutions to meet your specific business requirements. 
                                Let's discuss how we can help you.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
