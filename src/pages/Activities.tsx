import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import React, { useState } from "react";

const sections = [
    {
      id: "kindness101",
      title: "Kindness 101",
      icon: "💖",
      description: "Intro to kindness & why it matters",
      content: (
        <div>
          <p className="text-gray-700">Kindness 101 is an introduction to why being kind matters. Learn how small acts of kindness can make a big impact on the world!</p>
          <a 
            href="/pdfs/kindness101.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-aqua-600 underline block mt-2 font-semibold"
          >
            📄 Download PDF
          </a>
        </div>
      )
    },
    {
      id: "kindnessTips",
      title: "Kindness Tips",
      icon: "🌟",
      description: "Simple, everyday ways to be kind",
      content: (
        <div>
          <p className="text-gray-700">Here are easy kindness tips you can use every day to brighten someone's day! A smile, a kind word, or helping someone in need.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <img src="/images/kindness1.jpg" alt="Kindness Tip 1" className="rounded-lg shadow-md border border-yellow-400" />
            <img src="/images/kindness2.jpg" alt="Kindness Tip 2" className="rounded-lg shadow-md border border-yellow-400" />
          </div>
        </div>
      )
    },
    {
      id: "printableResources",
      title: "Printable Resources",
      icon: "📝",
      description: "Worksheets, coloring pages & journals",
      content: (
        <div>
          <p className="text-gray-700">Download and print worksheets, coloring pages, and journals to reflect on kindness and improve emotional well-being.</p>
          <ul className="mt-2 list-disc pl-5 text-aqua-600">
            <li><a href="/pdfs/worksheet1.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold">🖍 Coloring Page 1</a></li>
            <li><a href="/pdfs/journal.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold">📖 Kindness Journal</a></li>
          </ul>
        </div>
      )
    },
    {
      id: "videosAnimations",
      title: "Videos & Animations",
      icon: "🎬",
      description: "Fun, engaging kindness clips",
      content: (
        <div className="flex flex-col items-center justify-center text-center w-full">
            <iframe 
            width="600" 
            height="400" 
            src="https://www.youtube.com/embed/eRrAVRAHS2o?autoplay=1&loop=1&playlist=eRrAVRAHS2o&rel=0" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
            className="rounded-lg shadow-lg border border-pink-400"
            ></iframe>
        </div>
      )
    },
    {
      id: "kindnessJournal",
      title: "Kindness Journal",
      icon: "📖",
      description: "A space for kids to write about kind acts",
      content: (
        <div>
          <p className="text-gray-700">A kindness journal helps kids record their kind actions and reflect on how being kind makes them feel!</p>
          <textarea
            className="w-full h-32 border border-yellow-500 p-2 rounded-lg mt-3 bg-yellow-100"
            placeholder="Write your kind act here..."
          />
        </div>
      )
    }
  ];

const Dashboard: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFDAB9] via-[#98FB98] to-[#00FFFF]">
      <Header isLoggedIn={true} userType="student" userName="praftest" />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            
            {/* HEADER Kindness Corner */}
            <section className="animate-fade-in">
              <div className="glass-panel relative rounded-2xl p-6 md:p-8 w-full h-28 bg-white shadow-md border border-pink-300">
                <img 
                    src="hand_sticker.gif"
                    alt="Sticker"
                    className="absolute top-0 right-10 h-16 w-auto md:h-24" 
                />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-center text-yellow-600">
                  Kindness Quest
                </h1>
              </div>
            </section>

            {/* Sections Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in w-full">
                {sections.map((section) => (
                <div
                    key={section.id}
                    className="cursor-pointer overflow-hidden rounded-xl p-4 shadow-lg transition-all duration-300 bg-aqua-100 hover:bg-pink-200 border border-yellow-400"
                    onClick={() => setSelectedSection(section.id)}
                >
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">{section.icon}</div>
                    </div>
                    <h3 className="text-sm font-bold text-yellow-600 mt-2">
                      {section.title} 
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">{section.description}</p>
                </div>
                ))}
            </section>
       
            {/* Content Display Box */}
            <div className="w-full bg-white p-6 rounded-xl shadow-md border border-mint-400">
                {selectedSection ? (
                <div>
                    <h2 className="text-2xl font-bold text-yellow-700">
                    {sections.find((s) => s.id === selectedSection).title}
                    </h2>
                    <p className="mt-2 text-gray-700">
                    {sections.find((s) => s.id === selectedSection).content}
                    </p>
                </div>
                ) : (
                <p className="text-gray-500 text-center">Click a section to view details</p>
                )}
            </div>

          </div>
        </div>
     </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
