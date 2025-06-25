# 🎨 Stable Diffusion Frontend

Um frontend moderno em React para interagir com a API do Stable Diffusion, permitindo gerar imagens, gerenciar histórico e visualizar modelos LoRA disponíveis.

## ✨ Funcionalidades

- **🖼️ Geração de Imagens**: Interface intuitiva para criar imagens com prompts personalizados
- **📚 Histórico Completo**: Armazenamento local de todas as imagens geradas com metadados
- **🎯 Modelos LoRA**: Visualização e gerenciamento de modelos LoRA disponíveis
- **⚡ Progresso em Tempo Real**: Monitoramento do progresso de geração
- **📱 Design Responsivo**: Interface adaptada para desktop e mobile
- **🎨 UI Moderna**: Design limpo e intuitivo com animações suaves

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Styled Components** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **React Icons** para ícones
- **LocalStorage** para persistência de dados

## 📋 Pré-requisitos

- **Node.js** 16+ 
- **npm** ou **yarn**
- **Stable Diffusion WebUI** rodando em `http://192.168.3.70:7861`

## 🛠️ Instalação

1. **Clone o repositório**:
```bash
git clone <url-do-repositorio>
cd stable-diffusion-frontend
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure a API**:
   - Certifique-se de que o Stable Diffusion WebUI está rodando
   - A URL da API está configurada em `src/services/stableDiffusionApi.ts`
   - Se necessário, altere a URL base para corresponder ao seu setup

4. **Inicie o servidor de desenvolvimento**:
```bash
npm start
```

5. **Acesse a aplicação**:
   - Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🎯 Como Usar

### Geração de Imagens

1. **Acesse a página principal** (aba "Gerar")
2. **Digite seu prompt** na caixa de texto principal
3. **Configure os parâmetros**:
   - Dimensões da imagem (largura x altura)
   - Número de passos (steps)
   - CFG Scale (força do prompt)
   - Sampler (algoritmo de amostragem)
   - Seed (para reproduzibilidade)
   - Quantidade de imagens

4. **Clique em "Gerar Imagem"**
5. **Acompanhe o progresso** na barra de progresso
6. **Visualize as imagens** geradas no histórico

### Histórico de Imagens

1. **Acesse a aba "Histórico"**
2. **Visualize todas as imagens** geradas anteriormente
3. **Interaja com as imagens**:
   - Clique para ampliar
   - Baixe as imagens
   - Copie prompts ou imagens
   - Remova imagens individuais
   - Limpe todo o histórico

### Modelos LoRA

1. **Acesse a aba "LoRAs"**
2. **Visualize todos os modelos** LoRA disponíveis
3. **Busque por modelos** específicos
4. **Copie tags LoRA** para usar em prompts
5. **Visualize metadados** dos modelos

## ⚙️ Configuração da API

A aplicação está configurada para conectar com a API do Stable Diffusion em:
```
http://192.168.3.70:7861
```

Para alterar esta configuração, edite o arquivo `src/services/stableDiffusionApi.ts`:

```typescript
const API_BASE_URL = 'http://SEU_IP:SUA_PORTA';
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ImageGenerator.tsx   # Gerador de imagens
│   ├── ImageHistory.tsx     # Histórico de imagens
│   └── LoraList.tsx         # Lista de LoRAs
├── hooks/              # Hooks customizados
│   └── useImageHistory.ts   # Hook para histórico
├── services/           # Serviços da API
│   └── stableDiffusionApi.ts # Cliente da API
├── types/              # Definições TypeScript
│   └── api.ts              # Tipos da API
├── utils/              # Utilitários
│   └── imageUtils.ts       # Funções para imagens
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada
```

## 🎨 Personalização

### Temas e Cores

As cores principais podem ser alteradas nos componentes styled:

```typescript
// Cores principais
const primaryColor = '#007bff';
const secondaryColor = '#6c757d';
const dangerColor = '#dc3545';
```

### Layout

O layout é responsivo e pode ser personalizado através dos styled-components em cada arquivo de componente.

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta a configuração do CRA

## 🐛 Solução de Problemas

### Erro de Conexão com a API

1. **Verifique se o Stable Diffusion WebUI** está rodando
2. **Confirme o IP e porta** da API
3. **Verifique configurações de CORS** no WebUI
4. **Teste a API** diretamente no navegador

### Imagens não Carregam

1. **Verifique o console** do navegador para erros
2. **Confirme que as imagens** estão sendo salvas no localStorage
3. **Limpe o cache** do navegador se necessário

### Performance Lenta

1. **Monitore o uso de memória** (imagens em base64 são grandes)
2. **Limite o histórico** de imagens se necessário
3. **Use dimensões menores** para testes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. **Verifique a documentação** acima
2. **Consulte os logs** do console do navegador
3. **Abra uma issue** no repositório
4. **Verifique a configuração** da API do Stable Diffusion

---

**Desenvolvido com ❤️ para a comunidade de IA generativa**
