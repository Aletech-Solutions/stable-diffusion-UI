import React, { useState } from 'react';
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useImageHistory } from '../hooks/useImageHistory';
import { GeneratedImage } from '../types/api';
import { 
  downloadImage,
  copyImageToClipboard,
  copyPromptToClipboard,
  formatTimestamp
} from '../utils/imageUtils';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ImageCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #333;
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Prompt = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Metadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetadataItem = styled.span`
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #545b62; }
        `;
    }
  }}
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const ImageHistory: React.FC = () => {
  const { images, loading, removeImage, clearHistory, getStats } = useImageHistory();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const stats = getStats();

  const handleDownload = (image: GeneratedImage) => {
    downloadImage(image);
  };

  const handleCopyImage = async (image: GeneratedImage) => {
    const success = await copyImageToClipboard(image);
    setCopyFeedback(success ? 'Imagem copiada!' : 'Erro ao copiar imagem');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCopyPrompt = async (image: GeneratedImage) => {
    const success = await copyPromptToClipboard(image);
    setCopyFeedback(success ? 'Prompt copiado!' : 'Erro ao copiar prompt');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleRemove = (imageId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem?')) {
      removeImage(imageId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      clearHistory();
    }
  };

  if (loading) {
    return (
      <Container>
        <div>Carregando histórico...</div>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Histórico de Imagens</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <ImageIcon sx={{ fontSize: 48 }} />
          </EmptyIcon>
          <h3>Nenhuma imagem gerada ainda</h3>
          <p>As imagens que você gerar aparecerão aqui</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Histórico de Imagens</Title>
          <Stats>
            <span>{stats.totalImages} imagens</span>
            <span>~{stats.totalSizeEstimate.toFixed(1)} MB</span>
          </Stats>
        </div>
        <Button variant="danger" onClick={handleClearAll}>
          <DeleteIcon sx={{ fontSize: 14 }} />
          Limpar Tudo
        </Button>
      </Header>

      {copyFeedback && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: '#28a745', 
          color: 'white', 
          padding: '12px 16px', 
          borderRadius: '8px',
          zIndex: 1001
        }}>
          {copyFeedback}
        </div>
      )}

      <Grid>
        {images.map((image) => (
          <ImageCard key={image.id}>
            <ImageContainer onClick={() => setSelectedImage(image)}>
              <Image 
                src={image.url}
                alt={image.prompt}
              />
              <ImageOverlay>
                <ActionButton onClick={(e) => { e.stopPropagation(); setSelectedImage(image); }}>
                  <ZoomInIcon />
                </ActionButton>
                <ActionButton onClick={(e) => { e.stopPropagation(); handleDownload(image); }}>
                  <DownloadIcon />
                </ActionButton>
              </ImageOverlay>
            </ImageContainer>
            
            <CardContent>
              <Prompt title={image.prompt}>{image.prompt}</Prompt>
              
              <Metadata>
                {image.parameters && (
                  <>
                    <MetadataItem>Imagem Gerada</MetadataItem>
                    <MetadataItem>{formatTimestamp(image.timestamp)}</MetadataItem>
                  </>
                )}
              </Metadata>
              
              <Timestamp>
                {formatTimestamp(image.timestamp)}
              </Timestamp>
              
              <ActionBar>
                <Button onClick={() => handleCopyPrompt(image)}>
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                  Prompt
                </Button>
                <Button onClick={() => handleCopyImage(image)}>
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                  Imagem
                </Button>
                <Button variant="danger" onClick={() => handleRemove(image.id)}>
                  <DeleteIcon sx={{ fontSize: 14 }} />
                  Remover
                </Button>
              </ActionBar>
            </CardContent>
          </ImageCard>
        ))}
      </Grid>

      <Modal isOpen={!!selectedImage} onClick={() => setSelectedImage(null)}>
        {selectedImage && (
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedImage(null)}>
              <CloseIcon />
            </CloseButton>
            <ModalImage 
              src={selectedImage.url}
              alt={selectedImage.prompt}
            />
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
}; 