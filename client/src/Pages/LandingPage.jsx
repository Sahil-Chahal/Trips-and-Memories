import NavigationLayout from "../Layouts/NavigationLayout.jsx";
import { useState } from "react";

function LandingPage() {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <NavigationLayout>
            <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-500 opacity-90"></div>
                    <div className="relative z-10 container mx-auto text-center text-white py-28 px-4">
                        <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
                            Welcome to <span className="text-yellow-300">Trips & Memories</span>
                        </h1>
                        <p className="text-2xl italic font-light mb-4 animate-fade-in-delayed">
                            "Travel is the only thing you buy that makes you richer."
                        </p>
                        <p className="text-lg mb-8 animate-fade-in-delayed">
                            Capture, share, and cherish your unforgettable adventures with the people who matter most.
                        </p>
                        <button className="px-8 py-4 bg-yellow-300 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                    <svg
                        className="absolute bottom-0 left-0 right-0 z-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                    >
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,224L48,218.7C96,213,192,203,288,192C384,181,480,171,576,186.7C672,203,768,245,864,245.3C960,245,1056,203,1152,192C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </section>


                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">Explore Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Trip Journals",
                                    description: "Create detailed trip journals with photos, locations, and notes.",
                                    icon: "📝",
                                },
                                {
                                    title: "Virtual Memory Box",
                                    description: "Store your favorite memories in a virtual time capsule to revisit later.",
                                    icon: "📦",
                                },
                                {
                                    title: "Collaborative Journals",
                                    description: "Invite friends to contribute and share memories in collaborative journals.",
                                    icon: "🤝",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg transform hover:-translate-y-3 transition-all"
                                >
                                    <div className="text-5xl mb-4 text-blue-600 dark:text-teal-400">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-gray-100 dark:bg-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-12">
                            What Our Users Say
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    quote:
                                        "Trips & Memories has allowed me to keep my most cherished memories in one place. I love how easy it is to share my adventures!",
                                    name: "Sarah J.",
                                    role: "Traveler",
                                },
                                {
                                    quote:
                                        "Collaborative journals have brought my friends and I closer as we document our travels together. Truly an amazing experience!",
                                    name: "Tom R.",
                                    role: "Adventurer",
                                },
                                {
                                    quote:
                                        "The virtual memory box is such a creative way to preserve memories. It's like a time capsule for the future!",
                                    name: "Emily L.",
                                    role: "Explorer",
                                },
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                                >
                                    <p className="text-lg italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
                                    <h3 className="text-xl font-bold mt-4">{testimonial.name}</h3>
                                    <p className="text-gray-500">{testimonial.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-20 bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10">Our Impact in Numbers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { number: "10K+", label: "Memories Shared" },
                                { number: "5K+", label: "Active Users" },
                                { number: "1K+", label: "Journals Created" },
                            ].map((stat, index) => (
                                <div key={index}>
                                    <h3 className="text-6xl font-extrabold text-blue-600 dark:text-teal-400">
                                        {stat.number}
                                    </h3>
                                    <p className="text-xl text-gray-600 dark:text-gray-300">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <div className="max-w-2xl mx-auto">
                            {[
                                {
                                    question: "How do I create a new trip journal?",
                                    answer:
                                        "To create a new trip journal, simply head to the 'My Journals' section, click on 'Create New Journal', and start documenting your adventure!",
                                },
                                {
                                    question: "Can I invite friends to my journals?",
                                    answer:
                                        "Yes! You can invite friends to contribute to your journal by adding them in the 'Contributors' section while editing your journal.",
                                },
                                {
                                    question: "How do I reset my password?",
                                    answer:
                                        "If you forgot your password, go to the 'Log In' page, click 'Forgot Password', and follow the instructions sent to your email.",
                                },
                            ].map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 p-6 mb-4 rounded-lg shadow-md"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full text-left flex justify-between items-center focus:outline-none"
                                    >
                                        <h3 className="text-xl font-semibold text-blue-600 dark:text-teal-400">
                                            {faq.question}
                                        </h3>
                                        <span>{openFAQ === index ? "-" : "+"}</span>
                                    </button>
                                    {openFAQ === index && (
                                        <p className="mt-4 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-20 bg-blue-600 dark:bg-blue-800 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Start Creating Your Memories Today!</h2>
                    <p className="text-xl mb-8">Join our community and relive your most unforgettable moments.</p>
                    <button className="px-8 py-4 bg-yellow-400 text-gray-800 font-semibold rounded-full shadow-md hover:bg-yellow-300 transition-transform transform hover:scale-105">
                        Get Started
                    </button>
                </section>
            </div>
        </NavigationLayout>
    );
}

export default LandingPage;
