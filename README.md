# Tracen Academy - Client Module

![Status](https://img.shields.io/badge/Status-Concluído-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Descrição:**
Este repositório contém o **Módulo do Aluno** do sistema Tracen Academy. É uma interface de autoatendimento desenvolvida especificamente para tablets acoplados a catracas e portarias de academias, focada em agilidade e facilidade de entrada de dados.

## Índice
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Integração](#integração)
- [Autores](#autores)

## Funcionalidades (Catraca)
- **Acesso via CPF:** Teclado numérico customizado e formatado para facilitar a entrada de dados em dispositivos touch.
- **Validação em Tempo Real:** Comunicação com o backend para verificação instantânea de status de matrícula.
- **Tela de Boas-vindas:** Feedback visual de acesso liberado com exibição de data, hora e frases motivacionais aleatórias.
- **Barra de Progresso:** Temporizador de 10 segundos para fechamento automático da tela de sucesso.

## Tecnologias Utilizadas
- **HTML5 & Tailwind CSS:** Interface moderna, responsiva e otimizada para dispositivos móveis/tablets.
- **JavaScript (ES6+):** Lógica de front-end, manipulação de DOM e temporizadores.
- **API Handler:** Camada de serviço dedicada para comunicação assíncrona com o ecossistema Tracen.

## Integração
Este módulo consome dados gerenciados pelo **Tracen Admin** e valida as informações através de serviços Firebase, garantindo que apenas alunos ativos tenham o acesso liberado.

## Autores
* **John** - *Desenvolvedor Front-end* - [GitHub](https://github.com/John-Cristopher)
* **Vinicius** - *Desenvolvedor Back-end* - [GitHub](https://github.com/ViniciusMarioziOliveira)
