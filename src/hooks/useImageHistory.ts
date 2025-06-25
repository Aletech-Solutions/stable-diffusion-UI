import { useState, useEffect, useCallback } from 'react';
import { GeneratedImage } from '../types/api';

const STORAGE_KEY = 'stable-diffusion-image-history';

export const useImageHistory = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar histórico do localStorage
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setImages(parsedImages);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de imagens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar no localStorage sempre que images mudar
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      } catch (error) {
        console.error('Erro ao salvar histórico de imagens:', error);
      }
    }
  }, [images, loading]);

  // Adicionar nova imagem ao histórico
  const addImage = useCallback((image: GeneratedImage) => {
    setImages(prevImages => [image, ...prevImages]);
  }, []);

  // Remover imagem do histórico
  const removeImage = useCallback((imageId: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
  }, []);

  // Limpar todo o histórico
  const clearHistory = useCallback(() => {
    setImages([]);
  }, []);

  // Obter imagem por ID
  const getImageById = useCallback((imageId: string) => {
    return images.find(img => img.id === imageId);
  }, [images]);

  // Obter estatísticas do histórico
  const getStats = useCallback(() => {
    return {
      totalImages: images.length,
      totalSizeEstimate: images.length * 0.5, // Estimativa em MB
      oldestImage: images.length > 0 ? new Date(Math.min(...images.map(img => img.timestamp))) : null,
      newestImage: images.length > 0 ? new Date(Math.max(...images.map(img => img.timestamp))) : null,
    };
  }, [images]);

  return {
    images,
    loading,
    addImage,
    removeImage,
    clearHistory,
    getImageById,
    getStats,
  };
}; 