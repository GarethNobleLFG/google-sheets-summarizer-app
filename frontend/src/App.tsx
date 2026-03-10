import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main-page/MainPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}