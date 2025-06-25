import { GeneratedImage, GenerationResponse } from '../types/api';

/**
 * Gera um ID único para a imagem no histórico local.
 */
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Converte a resposta da API em um array de objetos GeneratedImage.
 * @param response - A resposta da API.
 * @param prompt - O prompt usado na geração.
 * @param negativePrompt - O prompt negativo usado na geração.
 * @returns Um array de objetos GeneratedImage.
 */
export const convertToGeneratedImage = (
  response: GenerationResponse,
  prompt: string,
  negativePrompt?: string
): GeneratedImage[] => {
  if (!response.images || response.images.length === 0) {
    return [];
  }

  return response.images.map((base64Image) => ({
    id: generateImageId(),
    url: `data:image/png;base64,${base64Image}`,
    prompt,
    negativePrompt,
    parameters: response.parameters,
    info: response.info,
    timestamp: Date.now(),
  }));
};

/**
 * Inicia o download de uma imagem.
 * @param image - O objeto GeneratedImage.
 */
export const downloadImage = (image: GeneratedImage): void => {
  try {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `sd_image_${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erro ao tentar baixar a imagem:', error);
    // Fallback: abrir em nova aba
    window.open(image.url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Copia um texto para a área de transferência.
 * @param text - O texto a ser copiado.
 * @returns true se a cópia foi bem-sucedida, false caso contrário.
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    console.error('API de área de transferência não suportada.');
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar texto:', error);
    return false;
  }
};

/**
 * Copia uma imagem para a área de transferência.
 * @param image - O objeto GeneratedImage.
 * @returns true se a cópia foi bem-sucedida, false caso contrário.
 */
export const copyImageToClipboard = async (image: GeneratedImage): Promise<boolean> => {
  try {
    // Converter data URL para blob
    const response = await fetch(image.url);
    const blob = await response.blob();
    
    // Criar ClipboardItem e copiar
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Erro ao copiar imagem:', error);
    return false;
  }
};

/**
 * Copia o prompt de uma imagem para a área de transferência.
 * @param image - O objeto GeneratedImage.
 * @returns true se a cópia foi bem-sucedida, false caso contrário.
 */
export const copyPromptToClipboard = async (image: GeneratedImage): Promise<boolean> => {
  const promptText = image.negativePrompt 
    ? `${image.prompt}\n\nNegative prompt: ${image.negativePrompt}` 
    : image.prompt;
  
  return await copyTextToClipboard(promptText);
};

/**
 * Formata um timestamp para uma string de data e hora legível.
 * @param timestamp - O timestamp em milissegundos.
 * @returns A data e hora formatadas.
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Redimensionar imagem (para thumbnails)
export const resizeImage = (
  base64Image: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Não foi possível obter contexto do canvas'));
        return;
      }

      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Converter para base64
      const resizedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
      resolve(resizedBase64);
    };
    img.onerror = reject;
    img.src = base64Image.startsWith('data:') ? base64Image : `data:image/png;base64,${base64Image}`;
  });
};

// Calcular tamanho estimado da imagem em KB
export const estimateImageSize = (base64Image: string): number => {
  // Base64 é aproximadamente 33% maior que o arquivo original
  const sizeInBytes = (base64Image.length * 3) / 4;
  return Math.round(sizeInBytes / 1024); // KB
}; 