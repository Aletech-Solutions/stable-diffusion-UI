import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageHistory } from './components/ImageHistory';
import { GeneratedImage } from './types/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-right: auto;
  padding: 16px 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  text-decoration: none;
  color: ${props => props.$isActive ? '#007bff' : '#666'};
  font-weight: ${props => props.$isActive ? '600' : '500'};
  border-bottom: 3px solid ${props => props.$isActive ? '#007bff' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #007bff;
    background: rgba(0, 123, 255, 0.05);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 70px);
  padding: 20px 0;
`;

const RecentImages = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  z-index: 50;
`;

const RecentImagesTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
`;

const RecentImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const RecentImageThumb = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Componente para navegação ativa
const NavBar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Header>
      <Nav>
        <Logo>🎨 Stable Diffusion</Logo>
        <NavLinks>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            <HomeIcon sx={{ fontSize: 18 }} />
            Gerar
          </NavLink>
          <NavLink to="/history" $isActive={location.pathname === '/history'}>
            <HistoryIcon sx={{ fontSize: 18 }} />
            Histórico
          </NavLink>
        </NavLinks>
      </Nav>
    </Header>
  );
};

const App: React.FC = () => {
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);

  const handleImageGenerated = (images: GeneratedImage[]) => {
    // Adicionar novas imagens ao início da lista e manter apenas as 6 mais recentes
    setRecentImages(prev => [...images, ...prev].slice(0, 6));
  };

  return (
    <Router>
      <AppContainer>
        <NavBar />
        <Main>
          <Routes>
            <Route 
              path="/" 
              element={<ImageGenerator onImageGenerated={handleImageGenerated} />} 
            />
            <Route path="/history" element={<ImageHistory />} />
          </Routes>
        </Main>
        
        {/* Widget de imagens recentes */}
        <Routes>
          <Route 
            path="/" 
            element={
              recentImages.length > 0 && (
                <RecentImages>
                  <RecentImagesTitle>Imagens Recentes</RecentImagesTitle>
                  <RecentImageGrid>
                    {recentImages.slice(0, 6).map((image) => (
                      <RecentImageThumb
                        key={image.id}
                        src={image.url}
                        alt={image.prompt}
                        title={image.prompt}
                      />
                    ))}
                  </RecentImageGrid>
                </RecentImages>
              )
            } 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
