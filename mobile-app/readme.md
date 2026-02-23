# Mobile App - Carteirinha Digital

Aplicativo Android nativo para os alunos do SENAI acessarem a carteirinha digital e informações de matrícula.

## Tecnologias

* Kotlin
* Android SDK
* Retrofit (para consumo da API)

## Como Executar

1. Abra o Android Studio.
2. Selecione `File > Open...` e escolha a pasta `mobile-app`.
3. Aguarde o Gradle sincronizar as dependências.
4. Execute o app em um emulador ou dispositivo físico (Shift + F10).

**Nota:** Configure a `BASE_URL` no código para o IP da sua máquina local (ex: `http://192.168.X.X:8080`) para conseguir acessar a API do Spring Boot durante o desenvolvimento.