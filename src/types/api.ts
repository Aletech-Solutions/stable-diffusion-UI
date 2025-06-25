// Tipos para a API do Stable Diffusion
export interface LoraModel {
  name: string;
  alias: string;
  path: string;
  filename: string;
  hash: string;
  sha256: string;
  metadata: {
    [key: string]: any;
  };
}

/**
 * Interface para a requisição de geração de imagem, baseada na nova documentação.
 */
export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  styles?: string[] | null;
  seed?: number | null;
  subseed?: number | null;
  subseed_strength?: number | null;
  seed_resize_from_h?: number | null;
  seed_resize_from_w?: number | null;
  sampler_name?: string | null;
  scheduler?: string | null;
  batch_size?: number | null;
  n_iter?: number | null;
  steps?: number | null;
  cfg_scale?: number | null;
  distilled_cfg_scale?: number | null;
  width?: number | null;
  height?: number | null;
  restore_faces?: boolean;
  tiling?: boolean;
  do_not_save_samples?: boolean;
  do_not_save_grid?: boolean;
  eta?: number | null;
  denoising_strength?: number | null;
  s_min_uncond?: number | null;
  s_churn?: number | null;
  s_tmax?: number | null;
  s_tmin?: number | null;
  s_noise?: number | null;
  override_settings?: Record<string, any>;
  override_settings_restore_afterwards?: boolean;
  refiner_checkpoint?: string | null;
  refiner_switch_at?: number | null;
  disable_extra_networks?: boolean;
  comments?: Record<string, any>;
  enable_hr?: boolean;
  firstphase_width?: number | null;
  firstphase_height?: number | null;
  hr_scale?: number | null;
  hr_upscaler?: string | null;
  hr_second_pass_steps?: number | null;
  hr_resize_x?: number | null;
  hr_resize_y?: number | null;
  hr_checkpoint_name?: string | null;
  hr_sampler_name?: string | null;
  hr_scheduler?: string | null;
  hr_prompt?: string | null;
  hr_negative_prompt?: string | null;
  force_task_id?: string | null;
  sampler_index?: string;
  script_name?: string | null;
  script_args?: any[];
  send_images?: boolean;
  save_images?: boolean;
  alwayson_scripts?: Record<string, any>;
  infotext?: string | null;
}

/**
 * Interface para a resposta da API de geração de imagem.
 */
export interface GenerationResponse {
  images: string[] | null; // Base64 encoded images
  parameters: Record<string, any>;
  info: string;
}

/**
 * Interface para uma imagem gerada e armazenada no histórico.
 * O campo 'image' agora armazena a URL da imagem.
 */
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  timestamp: number;
  parameters?: Record<string, any>;
  info?: string;
}

/**
 * Interface para erros da API.
 */
export interface ApiError {
  status: 'error';
  message: string;
  [key: string]: any;
}

export interface SamplerInfo {
  name: string;
  aliases: string[];
  options: {
    [key: string]: any;
  };
}

export interface ModelInfo {
  title: string;
  model_name: string;
  hash: string;
  sha256: string;
  filename: string;
  config: string;
}

export interface ProgressResponse {
  progress: number; // 0 to 1
  eta_relative: number; // ETA in seconds
  state: Record<string, any>; // Current state snapshot
  current_image?: string | null; // Base64 format
  textinfo?: string | null; // Info text used by WebUI
}

export interface SamplerItem {
  name: string;
  aliases: string[];
  options: Record<string, any>;
} 