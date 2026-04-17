# Plano de Testes: Sistema Academia (Catraca Inteligente)

Com base na arquitetura do sistema proposta, os testes garantem o funcionamento individual de cada módulo (Catraca e Painel Admin) bem como sua integração com a API Flask e o banco de dados Firebase.

---

## 1. Testes da Aplicação 3: Front-End Administrativo (CRUD)

Este módulo é responsável pela gestão dos alunos. O teste visa garantir que os dados enviados por esse painel modifiquem corretamente o Firebase, para que a catraca receba dados atualizados.

### [ ] Teste 1.1: Cadastrando um Aluno (CREATE)
- **Ação:** Acesse o painel administrativo. Preencha o formulário para adicionar um novo aluno (Nome, CPF e um Status inicial, p. ex., "ATIVO"). Clique em Salvar.
- **Resultado Esperado:** 
  1. Uma mensagem de sucesso será exibida.
  2. O formulário deve ser esvaziado.
  3. O aluno recém-criado deve aparecer na lista/tabela de consulta.

### [ ] Teste 1.2: Consultando Alunos (READ)
- **Ação:** Recarregue a página (F5) do painel administrativo.
- **Resultado Esperado:** A tabela de alunos deve puxar do Firebase (via API) todos os registros cadastrados com seus repectivos `id`, `nome`, `cpf` e `status`.

### [ ] Teste 1.3: Editando um Aluno (UPDATE)
- **Ação:** Na lista de alunos, clique em **Editar** num aluno existente. Altere seu status de "ATIVO" para "BLOQUEADO" e salve a modificação.
- **Resultado Esperado:**
  1. Os dados originais preenchem o formulário ao clicar em Editar.
  2. Após clicar em salvar, um aviso de "Sucesso" surge.
  3. A lista de alunos na tela atualiza imediatamente e passa a exibir o status do aluno como "BLOQUEADO". *(Iremos testar isso na Catraca posteriormente)*.

### [ ] Teste 1.4: Excluindo um Aluno (DELETE)
- **Ação:** Adicione um aluno de teste ("Aluno Descartável / CPF Falso") e clique no botão de **Excluir** na tabela.
- **Resultado Esperado:** Um aviso de confirmação aparece. Após confirmar, a API deteta o aluno no Firebase e a tela se atualiza, removendo permanentemente aquele registro visualmente.

---

## 2. Testes da Aplicação 1: Tablet Catraca (Acesso de Alunos)

A catraca simula o terminal de entrada de alunos. O aluno digita seu CPF. A catraca deve enviar o CPF num arquivo JSON via `request` para a rota de consulta da API e esperar a resposta de validação de `status`.

### [ ] Teste 2.1: CPF de Aluno Com Status ATIVO (Liberação)
- **Ação:** Na tela da Catraca, insira o `cpf` de um aluno que no painel está com o estado "ATIVO". Simule a passagem / Entrar.
- **Resultado Esperado:** A interface deve emitir uma visualização permissiva (ex: uma mensagem verde "Acesso Liberado!" ou animação de catraca abrindo). A resposta via JSON da API confirmou que o status dele na base é ativo.

### [ ] Teste 2.2: CPF de Aluno com Status BLOQUEADO (Barramento)
- **Ação:** Na tela da Catraca, insira o `cpf` do aluno que você bloqueou anteriormente no passo do "Teste 1.3". Tente Entrar.
- **Resultado Esperado:** A interface deve agir de maneira restritiva (ex: Mensagem vermelha "Acesso Negado: Aluno Bloqueado"). A porta simulada da catraca permanece trancada.

### [ ] Teste 2.3: CPF Inexistente no Banco de Dados
- **Ação:** Insira um CPF que sabidamente NÃO existe na tabela de registros (ex: `000.000.000-00`).
- **Resultado Esperado:** A tela deve reportar "CPF Não Cadastrado / Acesso Negado" ou mensagem de erro equivalente amigável. Não deve ocorrer erro crítico (tela branca ou quebra de aplicação), ou seja, a API deve tratar a não visualização de registro devolvendo uma exceção tratada no backend em vez de "Server Error".

### [ ] Teste 2.4: Comportamento Sem Conexão à API
- **Ação:** Forneça propositalmente uma porta de API backend errada no fetch, ou simplesmente desligue o servidor Flask e tente passar o CPF.
- **Resultado Esperado:** A catraca não deve aparentar que "travou" infinitamente girando bolinha. Após certo limite de timeout a tela deve soltar: "Problemas na rede: Não foi possível conectar com o Backend." (Erro `Failed to fetch`).

---

## 3. Testes da Aplicação 2: API Backend e Integrações (Opcional)

Se os alunos forem expor as validações cruas com Postman/Insomnia:

### [ ] Validação 3.1: Envio do JSON da Catraca
- Mande um POST contendo `{ "cpf": "123..." }` na rota correspondente à catraca. 
- O servidor (Flask) tem a obrigação de retornar com status HTTP `200` com `{ "status": "ATIVO" }` (ou a resposta projetada) sem expor outros dados sensíveis além desses, para a rota da catraca.

### [ ] Validação 3.2: Persistência Real no Firebase
- Realizando o CRUD completo por meio da UI, o aluno deve constatar visualmente olhando seu "Realtime Database" ou "Firestore" no console do Firebase para verificar se as chaves ID, NOME, CPF e STATUS foram persistidas no Database formatado.

---

## Checklist de Execução

### Fase 1: Testes CRUD do Painel Admin
- [ ] Teste 1.1 - CREATE (Cadastro de Aluno)
- [ ] Teste 1.2 - READ (Consulta de Alunos)
- [ ] Teste 1.3 - UPDATE (Edição de Aluno)
- [ ] Teste 1.4 - DELETE (Exclusão de Aluno)

### Fase 2: Testes da Catraca
- [ ] Teste 2.1 - Acesso com CPF ATIVO
- [ ] Teste 2.2 - Acesso com CPF BLOQUEADO
- [ ] Teste 2.3 - CPF Inexistente
- [ ] Teste 2.4 - Sem Conexão à API

### Fase 3: Validação da API (Opcional)
- [ ] Validação 3.1 - Formato JSON da Catraca
- [ ] Validação 3.2 - Persistência no Firebase

---

## Notas Importantes

1. **Ordem de Execução**: Sempre execute os testes na sequência apresentada, pois há dependências entre eles (ex: Teste 1.3 precisa de dados do Teste 1.1).
2. **Dados de Teste**: Use CPFs fictícios para testes. Exemplo: `123.456.789-10`.
3. **Conexão Firebase**: Verifique se as credenciais do Firebase estão corretas no código.
4. **Timeout da API**: Defina um timeout adequado (recomendado: 5-10 segundos) para evitar comportamento indefinido.
5. **Feedback Visual**: Todas as operações devem fornecer feedback ao usuário (sucesso, erro, carregamento).

---

**Última atualização**: 17 de abril de 2026
