import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Recipes } from './components/Recipes';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { RecipeArchivePage } from './components/RecipeArchivePage';
import { RecipePage } from './components/RecipePage';

function HomePage() {
  return (
    <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Recipes />
        <Contact />
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipeArchivePage />} />
        <Route path="/recipes/:slug" element={<RecipePage />} />
        <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms-of-service" element={<LegalPage kind="terms" />} />
        <Route path="/cookie-policy" element={<LegalPage kind="cookies" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
