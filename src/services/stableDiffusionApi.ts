import axios, { AxiosResponse } from 'axios';
import {
  GenerationRequest,
  GenerationResponse,
  ProgressResponse,
  SamplerItem,
  ModelInfo,
  LoraModel
} from '../types/api';

// Usar URLs relativas para aproveitar o proxy do React
const API_BASE_URL = '';

// Endpoints da API AUTOMATIC1111
const TEXT_TO_IMG_ENDPOINT = '/sdapi/v1/txt2img';
const PROGRESS_ENDPOINT = '/sdapi/v1/progress';
const INTERRUPT_ENDPOINT = '/sdapi/v1/interrupt';
const SAMPLERS_ENDPOINT = '/sdapi/v1/samplers';
const MODELS_ENDPOINT = '/sdapi/v1/sd-models';
const LORAS_ENDPOINT = '/sdapi/v1/loras';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutos
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro na API');
    }
    throw new Error('Erro de conexão com a API');
  }
);

export class StableDiffusionApi {
  /**
   * Gera uma imagem a partir de um prompt de texto.
   * @param request - Os parâmetros para a geração da imagem.
   * @returns A resposta da API com as URLs das imagens geradas.
   */
  static async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response: AxiosResponse<GenerationResponse> = await apiClient.post(
        TEXT_TO_IMG_ENDPOINT,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * Obtém o progresso da geração atual.
   */
  static async getProgress(): Promise<ProgressResponse> {
    try {
      const response: AxiosResponse<ProgressResponse> = await apiClient.get(
        PROGRESS_ENDPOINT
      );
      return response.data;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw error;
    }
  }

  /**
   * Interrompe a geração atual.
   */
  static async interrupt(): Promise<void> {
    try {
      await apiClient.post(INTERRUPT_ENDPOINT);
    } catch (error) {
      console.error('Error interrupting generation:', error);
      throw error;
    }
  }

  /**
   * Obtém a lista de samplers disponíveis.
   */
  static async getSamplers(): Promise<SamplerItem[]> {
    try {
      const response: AxiosResponse<SamplerItem[]> = await apiClient.get(
        SAMPLERS_ENDPOINT
      );
      return response.data;
    } catch (error) {
      console.error('Error getting samplers:', error);
      throw error;
    }
  }

  /**
   * Verifica se a API está respondendo.
   * Pode ser necessário ajustar o endpoint de health check se ele mudou.
   */
  static async checkHealth(): Promise<boolean> {
    try {
      // Tentativa simples de conectar à API
      await apiClient.get('/docs');
      return true;
    } catch (error) {
      console.error('API Health Check Failed:', error);
      return false;
    }
  }

  /**
   * Obtém a lista de modelos/checkpoints disponíveis.
   */
  static async getModels(): Promise<ModelInfo[]> {
    try {
      const response: AxiosResponse<ModelInfo[]> = await apiClient.get(MODELS_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error getting models:', error);
      throw error;
    }
  }

  /**
   * Obtém a lista de Loras disponíveis.
   */
  static async getLoras(): Promise<LoraModel[]> {
    try {
      const response: AxiosResponse<LoraModel[]> = await apiClient.get(LORAS_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error getting loras:', error);
      throw error;
    }
  }
} 