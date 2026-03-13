import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Courses from './components/Courses';
import Faculty from './components/Faculty';
import Results from './components/Results';
import Timetable from './components/Timetable';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminBar from './components/AdminBar';
import { useAdmin } from './context/AdminContext';

// Pages for multi-page desktop navigation
const PAGES = ['home', 'courses', 'faculty', 'results', 'timetable', 'contact'];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const { isAdmin } = useAdmin();
  const isMobile = window.innerWidth <= 768;

  // On desktop: render only the active page (multi-page feel via state)
  // On mobile: render all sections as one scrollable page
  if (isMobile) {
    return (
      <>
        <Navbar activePage={activePage} setActivePage={setActivePage} isMobile />
        <Hero setActivePage={setActivePage} />
        <Stats />
        <Courses />
        <Faculty />
        <Results />
        <Timetable />
        <Contact />
        <Footer />
        {isAdmin && <AdminBar />}
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <><Hero setActivePage={setActivePage} /><Stats /></>;
      case 'courses': return <Courses fullPage />;
      case 'faculty': return <Faculty fullPage />;
      case 'results': return <Results fullPage />;
      case 'timetable': return <Timetable fullPage />;
      case 'contact': return <Contact fullPage />;
      default: return <><Hero /><Stats /></>;
    }
  };

  return (
    <>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
      {isAdmin && <AdminBar />}
    </>
  );
}
