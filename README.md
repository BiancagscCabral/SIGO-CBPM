# 🚒 SIGO - Frontend

Este repositório contém o código-fonte do frontend para o **SIGO (Sistema Integrado de Gestão de Ocorrência)** Desenvolvido com **React** e **Vite**, esta aplicação web serve como a interface principal para os bombeiros interagirem com o sistema, modernizando o processo de registro de ocorrências. Ela consome a API REST fornecida pelo [repositório backend](https://github.com/Kacaii/senac-brigade-server).

---

#### Menu

<p align="center">
    <a href="#-sobre-o-projeto"> Sobre</a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-objetivos-principais"> Objetivos </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-arquitetura-geral-do-sistema-sigo"> Arquitetura Geral </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-arquitetura-do-frontend"> Arquitetura Frontend </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-principais-funcionalidades"> Funcionalidades </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-tecnologias-e-apis-utilizadas-no-frontend"> Tecnologias e APIs (Frontend) </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-endpoints-consumidos"> Endpoints Consumidos </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-estrutura-de-pastas"> Estrutura de Pastas </a>&nbsp;&nbsp; | &nbsp;&nbsp;
    <a href="#-como-executar"> Como Executar </a>&nbsp;&nbsp;
</p>

---

## 💡 Sobre o Projeto

O SIGO é uma aplicação web e mobile desenvolvida para modernizar o processo de registro de ocorrências realizado pelo Corpo de Bombeiros. O sistema permite que os bombeiros façam registros digitais de ocorrências em campo, de forma segura e integrada, substituindo formulários físicos e agilizando a coleta e o envio das informações em tempo real.

O SIGO foi projetado para ser leve, rápido e acessível, permitindo o uso tanto em navegadores desktop quanto em dispositivos móveis. Ele integra dados de localização, registro de informações detalhadas sobre as ocorrências e sincronização com o banco de dados central.

Este repositório foca especificamente na **interface frontend** da aplicação.

---

## 🎯 Objetivos Principais

* **Facilitar** o registro e gerenciamento digital das ocorrências.
* Permitir **acesso rápido** a dados geográficos e informações do local.
* Garantir **integridade e segurança** dos dados em todas as etapas do processo.

---

## 🏛️ Arquitetura Geral do Sistema SIGO

A arquitetura do SIGO segue o modelo **cliente-servidor**, composta por:

* **Frontend (Este Repositório):**
    * Framework: **React + Vite**
    * Linguagem: **JavaScript**
    * Ambiente: **Node.js** (gerenciamento de dependências e build)
    * Comunicação: Consome a **REST API** do backend.
    * Recursos: Utiliza **Web APIs** nativas do navegador (geolocalização, armazenamento local).

* **Backend:**
    * Linguagem: **Gleam**
    * Framework/API: **Wisp** (REST API)
    * Responsabilidades: Receber, processar e armazenar os dados das ocorrências, gerenciar autenticação e lógica de negócio.

* **Banco de Dados:**
    * SGBD: **PostgreSQL** (Banco relacional principal).
    * Integração: Via **Pog** (Biblioteca Gleam para acesso ao PostgreSQL).

* **Infraestrutura:**
    * Conteinerização: **Docker**.
    * CI/CD: **GitHub Actions** (integração e deploy automatizados).
    * Ambiente de Desenvolvimento: **VSCode + WSL** (Windows Subsystem for Linux).

---

## 🏗️ Arquitetura do Frontend

A arquitetura específica do frontend foi pensada para promover **separação de responsabilidades**, **reutilização**, **testabilidade** e **escalabilidade**.

* **Componentização:** UI dividida em componentes reutilizáveis (`src/components/`) e páginas (`src/pages/`).
* **Gerenciamento de Estado:** React Context API (`src/contexts/`) para estado compartilhado (usuário, ocorrências).
* **Camada de Serviço:** Interações com a API isoladas em `src/services/`.
* **Roteamento:** Navegação gerenciada por `routes.jsx`.
* **Proteção de Rotas:** Acesso controlado via `ProtectedRoute.jsx`.
* **Hooks Customizados:** Lógica reutilizável extraída para hooks (`src/hooks/`).

---

## ✨ Principais Funcionalidades Implementadas (Frontend)

* Autenticação (Login, Recuperação de Senha, Verificação).
* Dashboard com visão geral e estatísticas.
* Registro de Ocorrências com geolocalização (via `Navigator.geolocation`).
* Listagem e Visualização de Ocorrências.
* Painel Administrativo para gerenciamento de Usuários e Equipes.
* Visualização de Relatórios.
* Configurações de Perfil e Preferências de Notificação.
* Layout Padrão com Cabeçalho e Barra Lateral.
* Componente Modal reutilizável.
* Funcionalidades de Acessibilidade (controle por voz via `useSpeech.js`) Controle de tema claro/escuro e Ajustes do tamanho do texto.
* Persistência local (`localStorage`) para rascunhos ou cache (`minhasOcorrencias`).

---

## 🚀 Tecnologias e APIs Utilizadas no Frontend

### Frontend & Ferramentas

* **React**: Biblioteca principal para construção da interface.
* **Vite**: Ferramenta de build e servidor de desenvolvimento (`http://localhost:5173`). Utiliza proxy para redirecionar requisições `/api`.
* **JavaScript (ES6+)**: Linguagem principal.
* **CSS**: Estilização (arquivos `.css` por componente/página).
* **Node.js / npm**: Gerenciamento de dependências e scripts (`dev`, `build`).

### APIs do Navegador / Web

* **Fetch API**: Para realizar requisições HTTP (com `credentials: 'include'`).
* **localStorage**: Armazenamento local.
* **Navigator.geolocation**: Obtenção de coordenadas GPS.
* **DOM API**: Manipulada pelo React.
* **Console / DevTools**: Para logging e debugging.

### APIs Externas

* **Nominatim / OpenStreetMap**: Para geocodificação reversa.

---

## 🔗 Endpoints Consumidos (Backend REST API)

O frontend interage com a API REST do backend, consumindo endpoints como:

* `POST /user/login`
* `PUT /user/password`
* `POST /admin/setup`
* `POST /admin/signup`
* `GET /admin/users`
* `PUT /admin/users/{id}`
* `DELETE /admin/users/{id}`
* `PUT /admin/users/{id}/status`
* `GET /admin/teams`
* `POST /admin/teams`
* `PUT /admin/teams/{id}/status`
* `DELETE /admin/teams/{id}`
* `GET /dashboard/stats`
* `GET /user/profile`
* `GET /user/{id}/occurrences`
* `GET /user/{id}/crew_members`
* `GET /user/roles`
* `GET /user/notification_preferences`
* `PUT /user/notification_preferences`
* `POST /occurrence/new`
* `DELETE /occurrence/{id}`
* `GET /brigade/{id}/members`

*(Consulte a documentação da API backend para detalhes sobre payloads e respostas).*

---

## 🛠️ Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/BiancagscCabral/SIGO-CBPM.git
    cd .\sigo-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente (se necessário):**
    * Crie um arquivo `.env` na raiz do projeto se houver configurações específicas (como a URL base da API, caso não use proxy).

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:5173](http://localhost:5173).

**Pré-requisitos:**

* Node.js e npm instalados.
* O servidor [backend do Sigo dos Bombeiros](<URL_DO_REPOSITORIO_BACKEND_SE_TIVER>) deve estar em execução para que a aplicação funcione corretamente (a configuração de proxy do Vite deve apontar para a URL do backend).

---

## 👥 Autores

Esta seção lista os membros da equipe que contribuíram para o desenvolvimento do frontend do SIGO dos Bombeiros.

### 📊 Gestão

* **Thaise Renaux** - Direção de Projeto / P.O / Design (UI/UX)
    * [Linkedin](https://www.linkedin.com/in/thaise-renaux-4b0195351/)
    * [Github](https://github.com/THAISERENAUX)

### 💻 Desenvolvimento Frontend

* **Bianca Guimarães** - Desenvolvedor Frontend
    * [Linkedin](https://www.linkedin.com/in/bianca-guimar%C3%A3essacabral/)
    * [Github](https://github.com/BiancagscCabral)
* **Gislany Araujo** - Desenvolvedor Frontend / Design (UI/UX) /  Scrum Master
    * [Linkedin](https://www.linkedin.com/in/gislany-araujo-dev/)
    * [Github](https://github.com/gislanysa)
* **João Marcos** - Desenvolvedor Frontend
    * [Linkedin](https://www.linkedin.com/in/jmtmds/)
    * [Github](https://github.com/jmtmds)

### 💻 Desenvolvimento Backend

* **Pedro Ayres** - Desenvolvedor Backend
    * [Linkedin](https://www.linkedin.com/in/pedro-ayres-307353189/)
    * [Github](https://github.com/Kacaii)
* **Lucas Eloi** - Desenvolvedor Backend
    * [Linkedin](https://www.linkedin.com/in/jos%C3%A9lucaseloi062/)
    * [Github](https://github.com/Eloi-0001)
