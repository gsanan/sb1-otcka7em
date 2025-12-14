
import { useEffect, useState } from 'react';
import { Home, GraduationCap, Settings, Palette, Target } from 'lucide-react';
import './App.css';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  hasSubNav?: boolean;
  subNavItems?: { id: string; label: string }[];
}

const navItems: NavItem[] = [
  { id: 'biography', label: 'Biography', icon: Home },
  {
    id: 'education',
    label: 'Education & Experience',
    icon: GraduationCap,
    hasSubNav: true,
    subNavItems: [
      { id: 'education-main', label: 'Education' },
      { id: 'experience', label: 'Experience' }
    ]
  },
  {
    id: 'extracurricular',
    label: 'Extracurricular Activities',
    icon: Settings,
    hasSubNav: true,
    subNavItems: [
      { id: 'clubs', label: 'Club & Organization' },
      { id: 'volunteer', label: 'Volunteer Work' }
    ]
  },
  { id: 'hobbies', label: 'Hobbies', icon: Palette },
  { id: 'goals', label: 'Goals and mission', icon: Target }
];

const slideMapping: Record<string, number[]> = {
  biography: [1],
  'education-main': [2, 3, 4, 5, 6],
  experience: [7, 8, 9, 10],
  clubs: [11, 12, 13, 14, 15, 16, 17],
  volunteer: [18, 19, 20, 21, 22],
  hobbies: [23, 24, 25],
  goals: [26]
};

const sectionSubMap: Record<string, string[]> = {
  education: ['education-main', 'experience'],
  extracurricular: ['clubs', 'volunteer']
};

function App() {
  const [activeSection, setActiveSection] = useState('biography');
  const [activeSubSection, setActiveSubSection] = useState('');

  const getImageUrl = (n: number) =>
    `https://raw.githubusercontent.com/gsanan/port-image2/main/Saved%20Pictures/Slide%20${n}.jpg`;

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('.section');
      let currentSection = '';
      const sectionTrigger = window.innerHeight * 0.3;

      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= sectionTrigger && rect.bottom > sectionTrigger) {
          currentSection = s.id;
        }
      });

      if (currentSection) setActiveSection(currentSection);

      const validSubs = sectionSubMap[currentSection] || [];
      if (validSubs.length === 0) {
        setActiveSubSection('');
        return;
      }

      const sectionEl = document.getElementById(currentSection);
      if (!sectionEl) {
        setActiveSubSection('');
        return;
      }

      const subs = Array.from(sectionEl.querySelectorAll('[data-sub]'));
      const headerOffset = 220;

      let currentSub = '';

      subs.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          currentSub = el.getAttribute('data-sub') || '';
        }
      });

      setActiveSubSection(currentSub);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderSection = (
    sectionId: string,
    title: string,
    subNav?: { id: string; label: string }[]
  ) => {
    if (subNav) {
      return (
        <div id={sectionId} className="section">
          <div className="sticky-header">
            <h1 className="section-title">{title}</h1>
          </div>

          <div className="subnav-container sticky-subnav">
            {subNav.map((s) => (
              <button
                key={s.id}
                className={`subnav-button ${
                  activeSubSection === s.id ? 'active' : 'inactive'
                }`}
                onClick={() =>
                  document
                    .querySelector(`[data-sub="${s.id}"]`)
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          {subNav.map((s) => (
            <div key={s.id} data-sub={s.id}>
              <div className="slides-container">
                {slideMapping[s.id].map((n) => (
                  <div key={n} className="slide">
                    <img src={getImageUrl(n)} alt={`Slide ${n}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div id={sectionId} className="section">
        {sectionId !== 'biography' && sectionId !== 'goals' && (
          <div className="sticky-header">
            <h1 className="section-title">{title}</h1>
          </div>
        )}

        <div className="slides-container">
          {slideMapping[sectionId]?.map((n) => (
            <div key={n} className="slide">
              <img src={getImageUrl(n)} alt={`Slide ${n}`} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Duy An</div>
          <div className="sidebar-subtitle">
            HUS High School for Gifted Students
          </div>
        </div>

        <ul className="nav-list">
          {navItems.map((i) => {
            const Icon = i.icon;
            return (
              <li key={i.id}>
                <button
                  className={`nav-button ${
                    activeSection === i.id ? 'active' : ''
                  }`}
                  onClick={() => handleNavClick(i.id)}
                >
                  <Icon size={20} />
                  <span>{i.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="main-content">
        {renderSection('biography', 'Biography')}
        {renderSection('education', 'Education', navItems[1].subNavItems)}
        {renderSection(
          'extracurricular',
          'Extracurricular Activities',
          navItems[2].subNavItems
        )}
        {renderSection('hobbies', 'Hobbies')}
        {renderSection('goals', 'Goals & Mission')}
      </main>
    </div>
  );
}

export default App;
