import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Welcome from './Welcome';
import DisplayQuestions from './DisplayQuestions';
import EndScreen from './EndScreen';
import Scoreboard from './Scoreboard';
import Join from './Join';
import Result from './Result';
import DonutProgressBar from './DonutProgressBar';
import Loading from './Loading';
import RainbowTimer from './RainbowTimer';
import DisplaySpectrum from './DisplaySpectrum';
import { QuestionsProvider, useQuestions } from './QuestionsContext'; 
import { v4 as uuidv4 } from 'uuid';
import { initGA, logPageView } from './Analytics';

const App = () => {
  useEffect(() => {
    const getUserId = () => {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      return userId;
    };
    const userId = getUserId();
    console.log("User ID:", userId);

    initGA();
    logPageView();
    window.addEventListener('locationchange', logPageView);
    
    return () => {
      window.removeEventListener('locationchange', logPageView);
    };

  }, []);

  return (
    <QuestionsProvider> 
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/spectrum" />} />
          <Route path="/spectrum" element={<Welcome />} />
          <Route path="/classic" element={<Welcome />} />
          <Route path="/classic/game/:gameId" element={<DisplayQuestions />} />
          <Route path="/spectrum/game/:gameId" element={<DisplaySpectrum />} />
          <Route path="/endscreen/:gameId" element={<EndScreen />} />
          <Route path="/scoreboard/:gameId" element={<Scoreboard />} />
          <Route path="/join/:gameId" element={<Join />} />
          <Route path="/result/:gameId" element={<Result />} />
        </Routes>
      </div>
    </Router>
    </QuestionsProvider>
  );
}

export default App;
