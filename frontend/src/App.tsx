import { useState, useRef } from 'react';
import { SurveyCategory } from './types';
import Header from './components/Header/Header';
import CategorySelector from './components/CategorySelector/CategorySelector';
import SurveySection from './components/SurveySection/SurveySection';
import LiveInsights from './components/LiveInsights/LiveInsights';
import CityPulseOverview from './components/CityPulseOverview/CityPulseOverview';
import RecentSurveys from './components/RecentSurveys/RecentSurveys';
import CommunityShare from './components/CommunityShare/CommunityShare';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './styles/global.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<SurveyCategory | null>(null);
  const [surveyInsight, setSurveyInsight] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const categorySelectorRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  const handleStartSurvey = () => {
    categorySelectorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: SurveyCategory) => {
    setSelectedCategory(category);
    setShowResults(false);
  };

  const handleSurveyComplete = (insight: string) => {
    setSurveyInsight(insight);
    setShowResults(true);
    setSelectedCategory(null);
    
    setTimeout(() => {
      insightsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="app">
      <ParticlesBackground />
      <Header onStartSurvey={handleStartSurvey} />
      
      <div ref={categorySelectorRef}>
        {!selectedCategory && !showResults && (
          <CategorySelector onSelectCategory={handleSelectCategory} />
        )}
      </div>

      {selectedCategory && (
        <SurveySection
          category={selectedCategory}
          onComplete={handleSurveyComplete}
          onBack={handleBackToCategories}
        />
      )}

      {showResults && (
        <>
          <div ref={insightsRef}>
            <LiveInsights insight={surveyInsight} />
          </div>
          <CityPulseOverview />
          <RecentSurveys />
        </>
      )}

      {!selectedCategory && !showResults && (
        <RecentSurveys />
      )}

      <CommunityShare />
      <ScrollToTop />
    </div>
  );
}

export default App;
