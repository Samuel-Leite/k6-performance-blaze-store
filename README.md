## 🚀 Introdução:
Projeto de Teste de Performance utilizando K6 com a linguagem JavaScript através da plataforma demoblaze visando validar ao adicionar produto ao carrinho de compra.

## 📚 Conceitos gerais:
O teste de desempenho é uma avaliação sistemática do comportamento do sistema sob diferentes condições de carga, visando medir e melhorar sua velocidade, escalabilidade, estabilidade e confiabilidade. Ele busca identificar potenciais gargalos, otimizar recursos e garantir que o sistema atenda aos requisitos de desempenho esperados pelo usuário.
Breakpoint Test (Teste de Ponto de Ruptura): Avalia o sistema para determinar o ponto exato em que ele falha ou atinge seu limite máximo de capacidade.

- **Load Test (Teste de Carga):** Avalia o comportamento do sistema sob condições normais de carga para verificar desempenho, estabilidade e escalabilidade.

- **Smoke Test (Teste de Fumaça):** Teste rápido e superficial para verificar se as - principais funcionalidades do sistema estão funcionando corretamente, geralmente realizado após mudanças significativas no código ou na infraestrutura.

- **Soak Test (Teste de Durabilidade):** Avalia o comportamento do sistema ao longo de um período prolongado de tempo sob carga constante, buscando identificar problemas de vazamento de recursos ou degradação do desempenho.

- **Spike Test (Teste de Pico):** Avalia como o sistema se comporta quando há picos repentinos e significativos de tráfego, simulando eventos como lançamento de produto, campanhas promocionais ou eventos de notícias.

- **Stress Test (Teste de Estresse):** Testa os limites do sistema, aumentando gradualmente a carga até que o sistema comece a mostrar sinais de estresse, como tempo de resposta lento ou erros.

## 💻 Tecnologias e ferramentas
- K6
- JavaScript
- Grafana Cloud
- Jenkins
- Github Actions

## 🤖 Comandos para executar o projeto
- Executar na máquina local

```
k6 run {nome do arquivo}.js
```

- Executar e gerar relatório em HTML, precisa adicionar as seguintes configurações:
    - Há exemplo no arquivo 'smoke-test.js'

```
// Fazer o importe do report HTML
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// adicionar o comando abaixo na desmontagem da execução do teste
export function handleSummary(data) {
  return {
    "result_k6.html": htmlReport(data),
  };
}

// executar o comando:
k6 run {nome do arquivo}.js
```

- Executar e gerar relatório no K6 Dashboard através do Git Bash
    - Acessar o endereço do K6 dashboard: http://localhost:5665/ 

```
K6_WEB_DASHBOARD=true k6 run {nome do arquivo}.js
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT={nome relatorio}.html k6 run {nome do arquivo}.js
```

## Configuração e execução no Grafana Cloud
Após logar no Grafana Cloud, é necessário obter o token em: Home> Testing & synthetics > Performance > Settings > Personal API token.
- Após obtido o token, executar na pasta do projeto através do gitbash/powershell
```
k6 login cloud --token {token obtido em Personal API token}
```
- Adicionar o comando abaixo ao script em options:
  - O ID do projeto está localizado em: Home> Testing & synthetics > Performance > Projects > Pasta do projeto cadastrado
  - Há exemplo no arquivo 'load-test.js'
```
export const options = {
ext: {
        loadimpact: {
            projectID: {ID do projeto}
        }
    }
}    
```    

- Comando para executar integrado ao Grafana Cloud

```
k6 cloud {nome do arquivo}.js
k6 run --out cloud {nome do arquivo}.js
```

## Configuração e execução em Pipeline (Jenkins), integrando ao Grafana Cloud:
Após logar no Jenkins, acesse: Nova Tarefa > Digita nome da Pipeline > Selecione Pipeline > Preencha os dados abaixo no Script da Pipeline:
  - No campo Build Triggers > Construir periodicamente > Preencha com a data para ser executado periodicamente

```
pipeline {
    agent any

    environment{
        K6_CLOUD_TOKEN = credentials("nome_variavel")
        K6_CLOUD_PROJECT_ID = 'id_grafana_cloud'
    }

    stages {
        
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'link_repositorio'
            }
        }
        
        stage('K6') {
            steps {
                bat 'k6 cloud {nome do arquivo}.js --quiet'
            }
        }
    }
}
```

## 📷 Evidências dos reports gerados após execução dos testes: