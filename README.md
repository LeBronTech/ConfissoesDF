# ⛪ Horários de Confissão - Distrito Federal (DF)

Uma aplicação web moderna, intuitiva e responsiva desenvolvida para facilitar a consulta de horários do sacramento da confissão e reconciliação em paróquias, santuários e capelas de todo o Distrito Federal.

---

## ✨ Funcionalidades Principais

- 🔍 **Busca em Tempo Real**: Pesquise pelo nome da paróquia, perfil do Instagram ou palavras-chave presentes nas observações de horários.
- 🏙️ **Filtro de Cidades / Regiões (Multi-Seleção)**:
  - Selecione uma ou múltiplas cidades/regiões administrativas simultaneamente.
  - Busca integrada no seletor de cidades, com contadores e tags removíveis.
- 📅 **Filtro por Dia da Semana**:
  - Filtre por qualquer dia específico (Segunda a Domingo) ou visualize a semana completa.
  - Barra de atalhos rápidos com chips de acesso direto aos dias.
- ⏰ **Filtro Inteligente por Período**:
  - **Manhã**: atendimentos até as 12h59.
  - **Tarde**: atendimentos entre as 13h00 e 18h00.
  - **Noite**: atendimentos a partir das 18h00.
  - Processamento e identificação de horários a partir do texto descritivo.
- 🗂️ **Dois Modos de Visualização**:
  - **Visualização em Cards**: Cards detalhados com informações da Matriz e Capelas, links de redes sociais e expansão de horários.
  - **Grade Semanal (7 Blocos)**: Visualização estruturada por dias da semana para planejamento fácil.
- ⭐ **Favoritos Locais**: Salve paróquias favoritas para acesso rápido (armazenadas diretamente no navegador).
- 📲 **Compartilhamento Rápido**: Copie o resumo completo de horários e contatos com um clique.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)**: Biblioteca para interfaces reativas e modulares.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior previsibilidade e manutenibilidade.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build rápida e leve para desenvolvimento moderno.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização utilitária elegante, acessível e totalmente responsiva.
- **[Lucide React](https://lucide.dev/)**: Conjunto completo de ícones minimalistas.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm` ou `yarn` / `pnpm`

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/horarios-confissao-df.git
   cd horarios-confissao-df
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no seu navegador:
   ```
   http://localhost:3000
   ```

---

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento na porta 3000.
- `npm run build`: Cria o bundle otimizado para produção na pasta `dist/`.
- `npm run preview`: Executa localmente o bundle de produção gerado.
- `npm run lint`: Executa a verificação de tipos com o compilador TypeScript (`tsc --noEmit`).

---

## 📁 Estrutura de Pastas

```text
├── public/                # Arquivos estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── CityMultiSelect.tsx    # Seletor múltiplo com pesquisa para cidades
│   │   ├── ParishCard.tsx         # Card detalhado de cada paróquia
│   │   └── WeeklyScheduleGrid.tsx # Visualização em grade semanal
│   ├── data.ts            # Base de dados com as paróquias do DF e horários
│   ├── types.ts           # Interfaces e definições de tipos TypeScript
│   ├── utils/
│   │   └── scheduleParser.ts      # Parser de horários, períodos e dias
│   ├── App.tsx            # Componente raiz com lógica de busca e filtros
│   ├── main.tsx           # Ponto de entrada React
│   └── index.css          # Configuração global de estilos Tailwind CSS
├── index.html             # Documento HTML principal
├── metadata.json          # Metadados da aplicação
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração do TypeScript
└── vite.config.ts         # Configuração do Vite
```

---

## 🤝 Contribuições

Contribuições com correções ou atualizações de horários das paróquias são muito bem-vindas!

1. Faça um Fork do projeto
2. Crie uma branch para sua modificação: `git checkout -b feature/atualizar-horarios`
3. Faça o commit das suas alterações: `git commit -m "docs: atualiza horários da Paróquia X"`
4. Envie para a branch: `git push origin feature/atualizar-horarios`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
