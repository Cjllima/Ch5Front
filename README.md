# TechFlow Dashboard

Projeto do Checkpoint 5 – FrontEnd Design. O objetivo é montar um painel para acompanhar projetos, tarefas e equipes usando HTML, Tailwind CSS e JavaScript puro.

## Integrantes
- Lucas Kaoru Nohara Pereira 
- Matheus Lemos Lima 

## Tecnologias
- HTML5
- Tailwind CSS via CDN
- CSS
- JavaScript puro
- localStorage para guardar o tema escolhido

## Como executar
1. Extraia a pasta do projeto.
2. Abra `techflow-dashboard` no VS Code.
3. Abra o `index.html` com o Live Server.
4. É preciso ter internet para carregar o Tailwind CSS via CDN.

## O que foi feito
- Navbar, sidebar, pesquisa e informações do usuário.
- Quatro indicadores e seis cards iniciais de projetos.
- Grid com cards de tamanhos diferentes.
- Modal de novo projeto com nome, responsável, categoria, prioridade, prazo e descrição.
- Validação dos campos com mensagens de erro e sucesso.
- Menu mobile, dropdown do usuário e filtro de projetos.
- Tema Light, Dark e System; a escolha fica salva no localStorage.
- Layout responsivo para celular, tablet e desktop.

## Conceitos usados
- Flexbox: `flex`, `flex-col`, `items-center`, `justify-between`, `flex-wrap` e `gap-*`.
- Grid: `grid`, `grid-cols-*`, `col-span-*`, `row-span-*` e `gap-*`.
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:` e `2xl:`.
- Estados: `hover:`, `focus:`, `active:`, `disabled:` e `group-hover`.
- Transições: `transition`, `transition-all`, `duration-*` e `ease-*`.
- Dark mode: `dark:` com JavaScript e `localStorage`.

## GitHub
Adicione aqui o link do repositório do grupo.

## Dificuldades encontradas
- Fazer o layout se adaptar a diferentes tamanhos de tela.
- Atualizar o tema com base na preferência do usuário e do sistema.
- Validar o formulário e mostrar o erro no campo correto.

Os dados e projetos são fictícios. Não há banco de dados nem backend.
