import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import { StableDiffusionApi } from '../services/stableDiffusionApi';
import { GenerationRequest, SamplerItem, ModelInfo } from '../types/api';
import { useImageHistory } from '../hooks/useImageHistory';
import { convertToGeneratedImage } from '../utils/imageUtils';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
          &:disabled { background: #6c757d; cursor: not-allowed; }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e1e5e9;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
  }
`;

const StatusText = styled.p<{ type?: 'info' | 'error' | 'success' }>`
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  
  ${props => {
    switch (props.type) {
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      case 'success':
        return `
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      default:
        return `
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        `;
    }
  }}
`;

interface ImageGeneratorProps {
  onImageGenerated?: (images: any[]) => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const { addImage } = useImageHistory();
  
  // Estados do formulário baseados na API AUTOMATIC1111
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(20);
  const [cfgScale, setCfgScale] = useState(7);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [batchSize, setBatchSize] = useState(1);
  const [samplerName, setSamplerName] = useState('Euler');
  
  // Estados da aplicação
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [samplers, setSamplers] = useState<SamplerItem[]>([]);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Presets de proporção
  const ratioPresets = [
    { label: 'SD 1.5 (512x512)', width: 512, height: 512 },
    { label: 'SDXL 1024x1024', width: 1024, height: 1024 },
    { label: 'SDXL 832x1216', width: 832, height: 1216 },
    { label: 'SDXL 1216x832', width: 1216, height: 832 },
    { label: 'Flux 768x1344', width: 768, height: 1344 },
    { label: 'Flux 1344x768', width: 1344, height: 768 },
    { label: 'Portrait (9:16)', width: 704, height: 1216 },
    { label: 'Landscape (16:9)', width: 1216, height: 704 },
  ];

  // Carregar samplers na inicialização
  useEffect(() => {
    const loadSamplers = async () => {
      try {
        const samplersData = await StableDiffusionApi.getSamplers().catch(() => []);
        setSamplers(samplersData);
      } catch (error) {
        console.error('Erro ao carregar samplers:', error);
      }
    };

    loadSamplers();
  }, []);

  // Carregar modelos/checkpoints
  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelsData = await StableDiffusionApi.getModels();
        setModels(modelsData);
        if (modelsData.length > 0) setSelectedModel(modelsData[0].model_name);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    };
    loadModels();
  }, []);

  // Monitorar progresso durante a geração
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isGenerating) {
      intervalId = setInterval(async () => {
        try {
          const progressData = await StableDiffusionApi.getProgress();
          setProgress(progressData.progress * 100);

          if (progressData.state) {
            // Atualizar status baseado no estado
            if (progressData.textinfo) {
              setStatus(progressData.textinfo);
            }
          }
        } catch (error) {
          // Ignorar erros de progresso para não interromper a geração
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, insira um prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStatus('Iniciando geração...');
    setProgress(0);

    try {
      const request: GenerationRequest = {
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim() || undefined,
        width,
        height,
        steps,
        cfg_scale: cfgScale,
        sampler_name: samplerName,
        seed: seed,
        batch_size: batchSize,
        n_iter: 1,
        restore_faces: false,
        tiling: false,
        send_images: true,
        save_images: false,
      };

      const response = await StableDiffusionApi.generateImage(request);

      // Converter resposta para GeneratedImage e adicionar ao histórico        
      const generatedImages = convertToGeneratedImage(response, prompt, negativePrompt);

      generatedImages.forEach(img => addImage(img));

      if (onImageGenerated) {
        onImageGenerated(generatedImages);
      }

      setStatus(`${generatedImages.length} imagem(ns) gerada(s) com sucesso!`);
      setProgress(100);

    } catch (err) {
      setError(`Erro ao gerar imagem: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      setStatus('');
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        if (!error) {
          setStatus('Pronto para gerar imagens!');
          setProgress(0);
        }
      }, 3000);
    }
  };

  const handleInterrupt = async () => {
    try {
      await StableDiffusionApi.interrupt();
      setStatus('Geração interrompida');
    } catch (err) {
      setError('Erro ao interromper geração');
    }
  };

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 2147483647));
  };

  return (
    <Container>
      <Card>
        <Title>Gerador de Imagens</Title>

        <FormGroup>
          <Label>Prompt *</Label>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que você quer gerar..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Prompt Negativo</Label>
          <TextArea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Descreva o que você NÃO quer na imagem..."
          />
        </FormGroup>

        <Row>
          <FormGroup>
            <Label>Modelo/Checkpoint</Label>
            <Select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
            >
              {models.map(model => (
                <option key={model.model_name} value={model.model_name}>
                  {model.title}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Proporção (Preset)</Label>
            <Select
              value={`${width}x${height}`}
              onChange={e => {
                const [w, h] = e.target.value.split('x').map(Number);
                setWidth(w);
                setHeight(h);
              }}
            >
              {ratioPresets.map(preset => (
                <option key={preset.label} value={`${preset.width}x${preset.height}`}>{preset.label}</option>
              ))}
              <option value={`${width}x${height}`}>Personalizado: {width}x{height}</option>
            </Select>
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Label>Passos</Label>
            <Input
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              min={1}
              max={150}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>CFG Scale</Label>
            <Input
              type="number"
              value={cfgScale}
              onChange={(e) => setCfgScale(parseFloat(e.target.value))}
              min={1}
              max={30}
              step={0.5}
            />
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Label>Sampler</Label>
            <Select
              value={samplerName}
              onChange={(e) => setSamplerName(e.target.value)}
            >
              {samplers.map((sampler) => (
                <option key={sampler.name} value={sampler.name}>
                  {sampler.name}
                </option>
              ))}
              {samplers.length === 0 && (
                <option value="Euler">Euler</option>
              )}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Quantidade</Label>
            <Input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              min={1}
              max={8}
            />
          </FormGroup>
        </Row>

        <FormGroup>
          <Label>Seed</Label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              type="number"
              value={seed || ''}
              onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Deixe em branco para aleatório"
              style={{ flex: 1 }}
            />
            <Button
              type="button"
              onClick={generateRandomSeed}
              title="Gerar seed aleatório"
            >
              <RefreshIcon />
            </Button>
          </div>
        </FormGroup>

        {isGenerating && (
          <>
            <ProgressBar progress={progress} />
            <StatusText type="info">
              {status} ({Math.round(progress)}%)
            </StatusText>
          </>
        )}

        {error && (
          <StatusText type="error">
            {error}
          </StatusText>
        )}

        {!isGenerating && !error && status && (
          <StatusText type={status.includes('sucesso') ? 'success' : 'info'}>
            {status}
          </StatusText>
        )}

        <ButtonGroup>
          {isGenerating ? (
            <Button 
              variant="danger" 
              onClick={handleInterrupt}
            >
              <StopIcon />
              Interromper
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleGenerate}
              disabled={!prompt.trim()}
            >
              <PlayArrowIcon />
              Gerar Imagem
            </Button>
          )}
        </ButtonGroup>
      </Card>
    </Container>
  );
}; 