import React, { useState } from 'react';
import { Theme, FlashCard } from '../types';
import { FLASHCARDS } from '../constants';

interface FlashCardViewProps {
  theme: Theme;
}

const ITEMS_PER_PAGE = 9;

const FlashCardView: React.FC<FlashCardViewProps> = ({ theme }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-500';
  const pageCount = Math.ceil(FLASHCARDS.length / ITEMS_PER_PAGE);

  const currentCards = FLASHCARDS.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleCardClick = (card: FlashCard) => {
    setSelectedCard(card);
    setIsFlipped(false);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setIsFlipped(false);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="animate-fadeIn pb-24 relative min-h-[70vh]">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Audio Terms</h2>
        <p className={textSecondary}>Tap to review definitions</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {currentCards.map((card) => {
           // Color coding by category
           const catColor = 
             card.category === 'Plugin' ? 'bg-blue-500' :
             card.category === 'Concept' ? 'bg-purple-500' : 'bg-emerald-500';
           
           return (
             <button
               key={card.id}
               onClick={() => handleCardClick(card)}
               className={`relative aspect-[3/4] rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 shadow-md group ${isDark ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-white hover:bg-gray-50'}`}
             >
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${catColor}`} />
                <span className={`text-xs uppercase tracking-wider mb-2 opacity-50 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  {card.category}
                </span>
                <span className={`font-semibold text-sm md:text-base leading-tight ${textPrimary} group-hover:text-purple-500 transition-colors`}>
                  {card.term}
                </span>
             </button>
           );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
         <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
            className={`p-2 rounded-full transition-colors ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-purple-500/10'}`}
         >
            <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
         </button>
         
         <div className="flex gap-1.5">
           {Array.from({ length: pageCount }).map((_, i) => (
             <div 
               key={i} 
               onClick={() => setCurrentPage(i)}
               className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === currentPage ? 'bg-purple-500 w-4' : (isDark ? 'bg-zinc-700' : 'bg-gray-300')}`}
             />
           ))}
         </div>

         <button
            disabled={currentPage === pageCount - 1}
            onClick={() => setCurrentPage(p => p + 1)}
            className={`p-2 rounded-full transition-colors ${currentPage === pageCount - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-purple-500/10'}`}
         >
            <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </button>
      </div>

      {/* Card Preview Modal */}
      {selectedCard && (
        <div 
          onClick={handleCloseModal}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          {/* Card Container (Perspective) */}
          <div 
            onClick={handleFlip}
            className="perspective-1000 w-full max-w-sm aspect-[3/4] cursor-pointer"
          >
             {/* Inner Card (Transform Style) */}
             <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side */}
                <div className={`absolute inset-0 backface-hidden rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 border-2 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-white'}`}>
                    <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${selectedCard.category === 'Plugin' ? 'bg-blue-500/20 text-blue-500' :
                          selectedCard.category === 'Concept' ? 'bg-purple-500/20 text-purple-500' : 'bg-emerald-500/20 text-emerald-500'}`
                    }>
                        {selectedCard.category}
                    </div>
                    
                    <h3 className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedCard.term}
                    </h3>
                    
                    <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Tap to flip
                    </p>
                </div>

                {/* Back Side */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 border-2 ${isDark ? 'bg-zinc-800 border-purple-500/50' : 'bg-gray-50 border-purple-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 text-center text-purple-500`}>
                        {selectedCard.term}
                    </h3>
                    <p className={`text-center text-lg leading-relaxed ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                        {selectedCard.definition}
                    </p>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 text-center text-white/50 text-sm pointer-events-none">
             Tap outside to close
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCardView;