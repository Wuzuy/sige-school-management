# 🎫 Sistema de Carteirinha Virtual - SIGE

**Documentação Técnica e Arquitetural**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Arquitetura](#arquitetura)
4. [Fluxo de Geração](#fluxo-de-geração)
5. [Backend - API](#backend---api)
6. [Modelo de Dados](#modelo-de-dados)
7. [Geração do PDF](#geração-do-pdf)
8. [QR Code](#qr-code)
9. [Email Service](#email-service)
10. [Aplicativo Mobile](#aplicativo-mobile)
11. [Implementação Futura](#implementação-futura)
12. [Segurança](#segurança)

---

## 1. Visão Geral

### 1.1. Conceito

A **Carteirinha Virtual** é um documento digital gerado automaticamente após a conclusão da matrícula do aluno, comprovando seu vínculo com o SENAI.

**Características:**
- 📄 Formato: PDF (portátil e universalmente compatível)
- 🔍 QR Code: Para validação presencial
- 📱 Acessível: Via email e aplicativo mobile
- 🔐 Seguro: Número único de matrícula e QR Code criptografado

---

### 1.2. Quando é Gerada

A carteirinha é gerada **automaticamente** quando:

```
Condição 1: status_aprovacao = 'APROVADA'
     E
Condição 2: status_matricula = 'CONCLUIDA'
```

**Trigger:**
- Ação da secretaria: "Concluir Matrícula" no Portal da Secretaria
- Processo automático: geração + envio por email

---

### 1.3. Dados Incluídos

```
🎫 Carteirinha Virtual - Conteúdo:
├── 📷 Foto do Aluno (se fornecida)
├── 👤 Nome Completo
├── 📄 CPF
├── 🆔 RG (opcional)
├── 🎓 Número de Matrícula (único)
├── 📚 Curso
├── 🏛️ Unidade SENAI
├── ⏰ Turno
├── 📅 Data de Matrícula
├── 📅 Data de Validade (2 anos após matrícula)
├── 🔍 QR Code (validação)
└── 🖼️ Logo SENAI
```

---

## 2. Requisitos do Sistema

### 2.1. Backend

**Tecnologias Necessárias:**

```xml
<!-- Maven Dependencies -->
<dependencies>
    <!-- PDF Generation -->
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
        <version>7.2.5</version>
    </dependency>
    
    <!-- QR Code Generation -->
    <dependency>
        <groupId>com.google.zxing</groupId>
        <artifactId>core</artifactId>
        <version>3.5.1</version>
    </dependency>
    <dependency>
        <groupId>com.google.zxing</groupId>
        <artifactId>javase</artifactId>
        <version>3.5.1</version>
    </dependency>
    
    <!-- Email Sending -->
    <!-- Email Sending -->
    <!-- npm i nodemailer -->
</dependencies>
```

---

### 2.2. Frontend (Mobile App)

**Tecnologias:**
- **Linguagem:** Kotlin (Android)
- **API Communication:** Retrofit
- **Armazenamento Local:** SQLite / Room
- **QR Code:** ZXing Android Embedded
- **UI:** Jetpack Compose ou XML Layouts

---

### 2.3. Infraestrutura

**Servidor:**
- Armazenamento: Mínimo 10GB para PDFs
- Pasta de uploads: `/uploads/carteirinhas/`

**Email Service:**
- SMTP configurado (Gmail, SendGrid, etc.)
- Template HTML para email

---

## 3. Arquitetura

### 3.1. Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                    GERAÇÃO DE CARTEIRINHA                    │
└─────────────────────────────────────────────────────────────┘

1️⃣ TRIGGER (Portal da Secretaria)
   │
   └─→ Secretaria clica "Concluir Matrícula"
       │
       └─→ PUT /api/inscricoes/{id}/matricula/concluir
           │
           └─→ Status_matricula = CONCLUIDA

2️⃣ BACKEND - Listener Event
   │
   └─→ @EventListener(MatriculaConcluidaEvent.class)
       │
       ├─→ 1. Buscar dados do aluno (inscrição completa)
       ├─→ 2. Gerar número de matrícula único
       ├─→ 3. Criar objeto Carteirinha
       ├─→ 4. Salvar no banco de dados
       │
       ├─→ 5. Chamar CarteirinhaService.gerarPDF()
       │   │
       │   ├─→ a. Criar documento PDF (iText)
       │   ├─→ b. Adicionar informações do aluno
       │   ├─→ c. Gerar QR Code (ZXing)
       │   ├─→ d. Inserir QR Code no PDF
       │   ├─→ e. Salvar PDF em /uploads/carteirinhas/{matricula}.pdf
       │   └─→ f. Retornar caminho do arquivo
       │
       └─→ 6. Chamar EmailService.enviarCarteirinha()
           │
           ├─→ a. Criar email HTML customizado
           ├─→ b. Anexar PDF da carteirinha
           ├─→ c. Incluir link para download do app
           ├─→ d. Enviar email via SMTP
           └─→ e. Log de confirmação

3️⃣ EMAIL ENVIADO
   │
   └─→ Aluno recebe:
       ├─→ PDF da carteirinha (anexo)
       ├─→ Link para download do app Android
       └─→ Instruções de uso

4️⃣ ACESSO VIA APP MOBILE (Futuro)
   │
   └─→ Aluno faz login no app
       │
       └─→ GET /api/carteirinhas/aluno/{alunoId}
           │
           ├─→ Backend retorna dados da carteirinha (JSON)
           ├─→ App renderiza carteirinha offline
           ├─→ Gera QR Code dinâmico localmente
           └─→ Aluno exibe carteirinha para validação
```

---

### 3.2. Componentes do Sistema

```
📦 Sistema de Carteirinha
│
├── 🗄️ BACKEND (Node.js + Express)
│   ├── Model: Carteirinha.java
│   ├── Repository: CarteirinhaRepository.java
│   ├── Service: CarteirinhaService.java
│   ├── Service: PDFGeneratorService.java
│   ├── Service: QRCodeService.java
│   ├── Service: EmailService.java
│   ├── Controller: CarteirinhaController.java
│   └── Event: MatriculaConcluidaEvent.java
│
├── 💾 BANCO DE DADOS
│   └── Tabela: carteirinhas
│       ├── id (PK)
│       ├── numero_matricula (UNIQUE)
│       ├── id_inscricao (FK)
│       ├── id_aluno (FK)
│       ├── pdf_path
│       ├── qr_code_data
│       ├── data_emissao
│       ├── data_validade
│       └── ativo (boolean)
│
├── 📁 FILE SYSTEM
│   └── /uploads/carteirinhas/
│       └── {numero_matricula}.pdf
│
├── 📧 EMAIL SERVICE
│   ├── Template: carteirinha-email.html
│   └── SMTP Configuration
│
└── 📱 MOBILE APP (Android - Kotlin)
    ├── Activity: MainActivity
    ├── Fragment: CarteirinhaFragment
    ├── ViewModel: CarteirinhaViewModel
    ├── Repository: CarteirinhaRepository
    ├── API: CarteirinhaApiService (Retrofit)
    ├── Database: AppDatabase (Room)
    └── Util: QRCodeGenerator
```

---

## 4. Fluxo de Geração

### 4.1. Passo a Passo Detalhado

#### **1. Conclusão da Matrícula**

**Backend Endpoint:**
```java
@PutMapping("/inscricoes/{id}/matricula/concluir")
public ResponseEntity<?> concluirMatricula(@PathVariable Long id) {
    Inscricao inscricao = inscricaoService.findById(id);
    inscricao.setStatusMatricula(StatusMatricula.CONCLUIDA);
    inscricaoService.save(inscricao);
    
    // Disparar evento
    applicationEventPublisher.publishEvent(
        new MatriculaConcluidaEvent(this, inscricao)
    );
    
    return ResponseEntity.ok("Matrícula concluída com sucesso");
}
```

---

#### **2. Event Listener - Geração Automática**

**MatriculaConcluidaListener.java:**
```java
@Component
public class MatriculaConcluidaListener {
    
    @Autowired
    private CarteirinhaService carteirinhaService;
    
    @Autowired
    private EmailService emailService;
    
    @EventListener
    public void handleMatriculaConcluida(MatriculaConcluidaEvent event) {
        Inscricao inscricao = event.getInscricao();
        
        try {
            // 1. Gerar e salvar carteirinha
            Carteirinha carteirinha = carteirinhaService.gerarCarteirinha(inscricao);
            
            // 2. Enviar por email
            emailService.enviarCarteirinha(
                inscricao.getIdUsuario().getEmail(),
                inscricao.getIdUsuario().getNome(),
                carteirinha
            );
            
            log.info("Carteirinha gerada e enviada: {}", carteirinha.getNumeroMatricula());
            
        } catch (Exception e) {
            log.error("Erro ao gerar carteirinha: {}", e.getMessage());
            // Notificar secretaria sobre falha
        }
    }
}
```

---

#### **3. Geração da Carteirinha**

**CarteirinhaService.java:**
```java
@Service
public class CarteirinhaService {
    
    @Autowired
    private CarteirinhaRepository repository;
    
    @Autowired
    private PDFGeneratorService pdfService;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    public Carteirinha gerarCarteirinha(Inscricao inscricao) {
        // 1. Gerar número de matrícula único
        String numeroMatricula = gerarNumeroMatricula();
        
        // 2. Criar objeto Carteirinha
        Carteirinha carteirinha = new Carteirinha();
        carteirinha.setNumeroMatricula(numeroMatricula);
        carteirinha.setIdInscricao(inscricao);
        carteirinha.setIdAluno(inscricao.getIdUsuario());
        carteirinha.setDataEmissao(LocalDate.now());
        carteirinha.setDataValidade(LocalDate.now().plusYears(2)); // Válida por 2 anos
        carteirinha.setAtivo(true);
        
        // 3. Gerar dados do QR Code
        String qrData = gerarDadosQRCode(carteirinha);
        carteirinha.setQrCodeData(qrData);
        
        // 4. Salvar no banco
        Carteirinha saved = repository.save(carteirinha);
        
        // 5. Gerar PDF
        String pdfPath = pdfService.gerarPDF(saved);
        saved.setPdfPath(pdfPath);
        
        // 6. Atualizar com caminho do PDF
        return repository.save(saved);
    }
    
    private String gerarNumeroMatricula() {
        // Formato: SENAI-YYYY-XXXXXX
        // Exemplo: SENAI-2024-000123
        int ano = LocalDate.now().getYear();
        long count = repository.count() + 1;
        return String.format("SENAI-%d-%06d", ano, count);
    }
    
    private String gerarDadosQRCode(Carteirinha carteirinha) {
        // JSON com dados para validação
        return String.format(
            "{\"matricula\":\"%s\",\"cpf\":\"%s\",\"validade\":\"%s\"}",
            carteirinha.getNumeroMatricula(),
            carteirinha.getIdAluno().getCpf(),
            carteirinha.getDataValidade()
        );
    }
}
```

---

## 5. Backend - API

### 5.1. Endpoints

#### **Endpoint 1: Buscar Carteirinha do Aluno**

```http
GET /api/carteirinhas/aluno/{alunoId}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": 1,
  "numeroMatricula": "SENAI-2024-000123",
  "aluno": {
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@email.com"
  },
  "curso": {
    "nome": "Técnico em Mecânica Industrial",
    "unidade": "SENAI João Monlevade",
    "turno": "Manhã"
  },
  "dataEmissao": "2024-01-15",
  "dataValidade": "2026-01-15",
  "qrCodeData": "{\"matricula\":\"SENAI-2024-000123\",\"cpf\":\"123.456.789-00\",\"validade\":\"2026-01-15\"}",
  "ativo": true
}
```

---

#### **Endpoint 2: Download do PDF**

```http
GET /api/carteirinhas/{id}/download
Authorization: Bearer {token}
```

**Response 200:**
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="carteirinha_SENAI-2024-000123.pdf"
- Body: (binary PDF data)

---

#### **Endpoint 3: Validar Carteirinha (QR Code)**

```http
POST /api/carteirinhas/validar
Authorization: Bearer {token}
Content-Type: application/json

{
  "qrCodeData": "{\"matricula\":\"SENAI-2024-000123\",\"cpf\":\"123.456.789-00\",\"validade\":\"2026-01-15\"}"
}
```

**Response 200:**
```json
{
  "valida": true,
  "aluno": {
    "nome": "João Silva",
    "curso": "Técnico em Mecânica Industrial",
    "unidade": "SENAI João Monlevade"
  },
  "dataValidade": "2026-01-15",
  "status": "ATIVA"
}
```

**Response 400:**
```json
{
  "valida": false,
  "motivo": "Carteirinha vencida"
}
```

---

## 6. Modelo de Dados

### 6.1. Entidade Carteirinha

**Carteirinha.java:**
```java
@Entity
@Table(name = "carteirinhas")
public class Carteirinha {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String numeroMatricula; // SENAI-2024-000123
    
    @OneToOne
    @JoinColumn(name = "id_inscricao", nullable = false)
    private Inscricao idInscricao;
    
    @ManyToOne
    @JoinColumn(name = "id_aluno", nullable = false)
    private Usuario idAluno;
    
    @Column(nullable = false, length = 255)
    private String pdfPath; // /uploads/carteirinhas/SENAI-2024-000123.pdf
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String qrCodeData; // JSON com dados criptografados
    
    @Column(nullable = false)
    private LocalDate dataEmissao;
    
    @Column(nullable = false)
    private LocalDate dataValidade;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Getters e Setters...
}
```

---

### 6.2. Repository

**CarteirinhaRepository.java:**
```java
@Repository
public interface CarteirinhaRepository extends JpaRepository<Carteirinha, Long> {
    
    Optional<Carteirinha> findByNumeroMatricula(String numeroMatricula);
    
    Optional<Carteirinha> findByIdAluno_Id(Long alunoId);
    
    List<Carteirinha> findByDataValidadeBefore(LocalDate data);
    
    @Query("SELECT c FROM Carteirinha c WHERE c.idAluno.id = :alunoId AND c.ativo = true")
    Optional<Carteirinha> findCarteirinhaAtivaByAluno(@Param("alunoId") Long alunoId);
}
```

---

## 7. Geração do PDF

### 7.1. PDFGeneratorService

**PDFGeneratorService.java:**
```java
@Service
public class PDFGeneratorService {
    
    @Value("${app.upload.carteirinhas}")
    private String uploadPath; // /uploads/carteirinhas/
    
    @Autowired
    private QRCodeService qrCodeService;
    
    public String gerarPDF(Carteirinha carteirinha) throws IOException {
        String fileName = carteirinha.getNumeroMatricula() + ".pdf";
        String filePath = uploadPath + fileName;
        
        // Criar diretório se não existir
        Files.createDirectories(Paths.get(uploadPath));
        
        try (PdfWriter writer = new PdfWriter(filePath);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, PageSize.A4)) {
            
            // Configurar margens
            document.setMargins(20, 20, 20, 20);
            
            // 1. Adicionar logo SENAI
            String logoPath = "src/main/resources/static/images/logo-senai.png";
            if (Files.exists(Paths.get(logoPath))) {
                Image logo = new Image(ImageDataFactory.create(logoPath));
                logo.scaleToFit(150, 50);
                logo.setHorizontalAlignment(HorizontalAlignment.CENTER);
                document.add(logo);
            }
            
            // 2. Título
            Paragraph titulo = new Paragraph("CARTEIRINHA DE ALUNO")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
            document.add(titulo);
            
            // 3. Foto do aluno (se disponível)
            String fotoPath = carteirinha.getIdAluno().getFotoPath();
            if (fotoPath != null && Files.exists(Paths.get(fotoPath))) {
                Image foto = new Image(ImageDataFactory.create(fotoPath));
                foto.scaleToFit(100, 100);
                foto.setHorizontalAlignment(HorizontalAlignment.CENTER);
                foto.setMarginTop(10);
                document.add(foto);
            }
            
            // 4. Informações do aluno
            Usuario aluno = carteirinha.getIdAluno();
            Inscricao inscricao = carteirinha.getIdInscricao();
            Curso curso = inscricao.getIdCurso();
            
            addCampo(document, "Nome:", aluno.getNome());
            addCampo(document, "CPF:", aluno.getCpf());
            addCampo(document, "Matrícula:", carteirinha.getNumeroMatricula());
            addCampo(document, "Curso:", curso.getNomeCurso());
            addCampo(document, "Unidade:", curso.getIdUnidade().getNomeUnidade());
            addCampo(document, "Turno:", curso.getTurno());
            addCampo(document, "Data de Emissão:", 
                carteirinha.getDataEmissao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            addCampo(document, "Validade:", 
                carteirinha.getDataValidade().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            
            // 5. QR Code
            byte[] qrCodeImage = qrCodeService.gerarQRCode(carteirinha.getQrCodeData(), 200, 200);
            Image qrCode = new Image(ImageDataFactory.create(qrCodeImage));
            qrCode.setHorizontalAlignment(HorizontalAlignment.CENTER);
            qrCode.setMarginTop(20);
            document.add(qrCode);
            
            // 6. Rodapé
            Paragraph rodape = new Paragraph("Documento válido em todo território nacional")
                .setFontSize(8)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
            document.add(rodape);
        }
        
        return filePath;
    }
    
    private void addCampo(Document document, String label, String valor) {
        Paragraph p = new Paragraph()
            .add(new Text(label + " ").setBold())
            .add(new Text(valor))
            .setMarginTop(5);
        document.add(p);
    }
}
```

---

### 7.2. Configuração no application.properties

```properties
# Carteirinha Upload Path
app.upload.carteirinhas=uploads/carteirinhas/
```

---

## 8. QR Code

### 8.1. QRCodeService

**QRCodeService.java:**
```java
@Service
public class QRCodeService {
    
    public byte[] gerarQRCode(String data, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height);
        
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        
        return pngOutputStream.toByteArray();
    }
    
    public String decodificarQRCode(BufferedImage qrCodeImage) throws NotFoundException {
        BinaryBitmap binaryBitmap = new BinaryBitmap(
            new HybridBinarizer(
                new BufferedImageLuminanceSource(qrCodeImage)
            )
        );
        
        Result result = new MultiFormatReader().decode(binaryBitmap);
        return result.getText();
    }
}
```

---

### 8.2. Estrutura do QR Code

**Formato JSON:**
```json
{
  "matricula": "SENAI-2024-000123",
  "cpf": "123.456.789-00",
  "validade": "2026-01-15",
  "hash": "a1b2c3d4e5f6..." // Hash SHA-256 para validação
}
```

**Geração do Hash:**
```java
private String gerarHash(Carteirinha carteirinha) {
    String data = carteirinha.getNumeroMatricula() + 
                  carteirinha.getIdAluno().getCpf() + 
                  carteirinha.getDataValidade() +
                  "SENAI_SECRET_KEY"; // Chave secreta do servidor
    
    try {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException("Erro ao gerar hash", e);
    }
}
```

---

## 9. Email Service

### 9.1. Template HTML

**carteirinha-email.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f4f4f4; }
        .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #003366; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0;
        }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Bem-vindo ao SENAI!</h1>
        </div>
        <div class="content">
            <p>Olá, <strong>{{NOME_ALUNO}}</strong>!</p>
            
            <p>Parabéns! Sua matrícula foi concluída com sucesso.</p>
            
            <p>Estamos enviando sua <strong>Carteirinha Virtual de Aluno</strong>.</p>
            
            <h3>📋 Informações da Matrícula:</h3>
            <ul>
                <li><strong>Número de Matrícula:</strong> {{NUMERO_MATRICULA}}</li>
                <li><strong>Curso:</strong> {{NOME_CURSO}}</li>
                <li><strong>Unidade:</strong> {{NOME_UNIDADE}}</li>
                <li><strong>Turno:</strong> {{TURNO}}</li>
                <li><strong>Data de Início:</strong> {{DATA_INICIO}}</li>
            </ul>
            
            <p>A carteirinha está anexada a este email em formato PDF.</p>
            
            <p><strong>📱 Baixe nosso aplicativo mobile:</strong></p>
            <a href="{{LINK_APP_ANDROID}}" class="button">📥 Download para Android</a>
            
            <p>Com o aplicativo, você pode:</p>
            <ul>
                <li>Acessar sua carteirinha offline</li>
                <li>Receber notificações importantes</li>
                <li>Consultar horários e notas</li>
                <li>Validar presença via QR Code</li>
            </ul>
            
            <p><strong>🎓 Desejamos sucesso na sua jornada!</strong></p>
        </div>
        <div class="footer">
            <p>SENAI - Serviço Nacional de Aprendizagem Industrial</p>
            <p>Este é um email automático. Não responda.</p>
        </div>
    </div>
</body>
</html>
```

---

### 9.2. EmailService - Envio

**EmailService.java:**
```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void enviarCarteirinha(String toEmail, String nomeAluno, Carteirinha carteirinha) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎓 Sua Carteirinha Virtual - SIGE");
            
            // Carregar template HTML
            String htmlContent = carregarTemplate(nomeAluno, carteirinha);
            helper.setText(htmlContent, true);
            
            // Anexar PDF
            FileSystemResource file = new FileSystemResource(new File(carteirinha.getPdfPath()));
            helper.addAttachment("Carteirinha_" + carteirinha.getNumeroMatricula() + ".pdf", file);
            
            mailSender.send(message);
            
            log.info("Email enviado com carteirinha para: {}", toEmail);
            
        } catch (MessagingException e) {
            log.error("Erro ao enviar email: {}", e.getMessage());
            throw new RuntimeException("Falha ao enviar email", e);
        }
    }
    
    private String carregarTemplate(String nomeAluno, Carteirinha carteirinha) {
        try {
            String template = new String(Files.readAllBytes(
                Paths.get("src/main/resources/templates/carteirinha-email.html")
            ));
            
            Inscricao inscricao = carteirinha.getIdInscricao();
            Curso curso = inscricao.getIdCurso();
            
            // Substituir placeholders
            template = template.replace("{{NOME_ALUNO}}", nomeAluno);
            template = template.replace("{{NUMERO_MATRICULA}}", carteirinha.getNumeroMatricula());
            template = template.replace("{{NOME_CURSO}}", curso.getNomeCurso());
            template = template.replace("{{NOME_UNIDADE}}", curso.getIdUnidade().getNomeUnidade());
            template = template.replace("{{TURNO}}", curso.getTurno());
            template = template.replace("{{DATA_INICIO}}", 
                curso.getDataInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            template = template.replace("{{LINK_APP_ANDROID}}", 
                "https://www.senai.br/app/carteirinha.apk");
            
            return template;
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar template", e);
        }
    }
}
```

---

## 10. Aplicativo Mobile

### 10.1. Arquitetura Android

**Estrutura do Projeto:**
```
app/
├── manifests/
│   └── AndroidManifest.xml
├── java/com/senai/carteirinha/
│   ├── MainActivity.kt
│   ├── ui/
│   │   ├── CarteirinhaFragment.kt
│   │   ├── LoginFragment.kt
│   │   └── SplashFragment.kt
│   ├── viewmodel/
│   │   └── CarteirinhaViewModel.kt
│   ├── repository/
│   │   └── CarteirinhaRepository.kt
│   ├── api/
│   │   ├── ApiService.kt
│   │   └── RetrofitClient.kt
│   ├── database/
│   │   ├── AppDatabase.kt
│   │   └── CarteirinhaDao.kt
│   ├── model/
│   │   ├── Carteirinha.kt
│   │   └── Usuario.kt
│   └── util/
│       ├── QRCodeGenerator.kt
│       └── Constants.kt
└── res/
    ├── layout/
    │   ├── activity_main.xml
    │   ├── fragment_carteirinha.xml
    │   └── fragment_login.xml
    └── values/
        ├── strings.xml
        ├── colors.xml
        └── themes.xml
```

---

### 10.2. Funcionalidades do App

#### **1. Login**
- Autenticação via API REST
- Armazenar token JWT localmente
- Auto-login (lembrar usuário)

#### **2. Visualização da Carteirinha**
- Buscar dados da API: `GET /api/carteirinhas/aluno/{id}`
- Salvar no banco local (SQLite)
- Exibir carteirinha offline
- Layout similar ao PDF

#### **3. QR Code Dinâmico**
- Gerar QR Code localmente usando ZXing
- Atualizar a cada abertura (timestamp)
- Prevenir screenshots (FLAG_SECURE)

#### **4. Sincronização**
- Verificar atualizações na API
- Sincronizar quando online
- Funcionar offline com dados salvos

---

### 10.3. Código Exemplo - Kotlin

**CarteirinhaFragment.kt:**
```kotlin
class CarteirinhaFragment : Fragment() {
    
    private lateinit var binding: FragmentCarteirinhaBinding
    private val viewModel: CarteirinhaViewModel by viewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCarteirinhaBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Prevenir screenshots
        activity?.window?.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        
        observarCarteirinha()
        viewModel.carregarCarteirinha()
    }
    
    private fun observarCarteirinha() {
        viewModel.carteirinha.observe(viewLifecycleOwner) { carteirinha ->
            carteirinha?.let {
                exibirCarteirinha(it)
                gerarQRCode(it)
            }
        }
    }
    
    private fun exibirCarteirinha(carteirinha: Carteirinha) {
        binding.apply {
            txtNome.text = carteirinha.aluno.nome
            txtCpf.text = carteirinha.aluno.cpf
            txtMatricula.text = carteirinha.numeroMatricula
            txtCurso.text = carteirinha.curso.nome
            txtUnidade.text = carteirinha.curso.unidade
            txtTurno.text = carteirinha.curso.turno
            txtValidade.text = carteirinha.dataValidade
            
            // Carregar foto
            Glide.with(this@CarteirinhaFragment)
                .load(carteirinha.aluno.fotoUrl)
                .placeholder(R.drawable.ic_profile_placeholder)
                .into(imgFoto)
        }
    }
    
    private fun gerarQRCode(carteirinha: Carteirinha) {
        val qrData = """
            {
                "matricula": "${carteirinha.numeroMatricula}",
                "cpf": "${carteirinha.aluno.cpf}",
                "timestamp": "${System.currentTimeMillis()}"
            }
        """.trimIndent()
        
        val qrCodeBitmap = QRCodeGenerator.gerar(qrData, 300, 300)
        binding.imgQrCode.setImageBitmap(qrCodeBitmap)
    }
}
```

---

### 10.4. API Service - Retrofit

**CarteirinhaApiService.kt:**
```kotlin
interface CarteirinhaApiService {
    
    @GET("carteirinhas/aluno/{alunoId}")
    suspend fun buscarCarteirinha(
        @Path("alunoId") alunoId: Long,
        @Header("Authorization") token: String
    ): Response<Carteirinha>
    
    @GET("carteirinhas/{id}/validar")
    suspend fun validarCarteirinha(
        @Path("id") id: Long
    ): Response<ValidationResponse>
}

object RetrofitClient {
    private const val BASE_URL = "http://192.168.1.100:8080/api/"
    
    val apiService: CarteirinhaApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(CarteirinhaApiService::class.java)
    }
}
```

---

## 11. Implementação Futura

### 11.1. Checklist de Desenvolvimento

**Backend:**
- [ ] Criar entidade `Carteirinha.java`
- [ ] Criar `CarteirinhaRepository.java`
- [ ] Implementar `CarteirinhaService.java`
- [ ] Implementar `PDFGeneratorService.java`
- [ ] Implementar `QRCodeService.java`
- [ ] Adicionar listener `MatriculaConcluidaEvent`
- [ ] Criar endpoints REST no `CarteirinhaController.java`
- [ ] Adicionar template HTML de email
- [ ] Configurar diretório de uploads
- [ ] Adicionar dependências Maven (iText, ZXing)
- [ ] Testar geração de PDF
- [ ] Testar envio de email

**Mobile App:**
- [ ] Criar projeto Android (Kotlin)
- [ ] Implementar tela de login
- [ ] Implementar tela de carteirinha
- [ ] Integrar Retrofit para API REST
- [ ] Implementar Room (banco local)
- [ ] Gerar QR Code localmente
- [ ] Prevenir screenshots (FLAG_SECURE)
- [ ] Adicionar splash screen
- [ ] Testar sincronização online/offline
- [ ] Publicar na Google Play Store

---

### 11.2. Roadmap de Funcionalidades

**Versão 1.0 (MVP):**
- ✅ Geração automática de carteirinha
- ✅ Envio por email
- ✅ PDF com QR Code
- ⏳ App Android básico

**Versão 2.0:**
- 📅 Calendário de aulas no app
- 🔔 Notificações push
- 📊 Consulta de notas e frequência
- 🎫 Validação presencial via NFC

**Versão 3.0:**
- 🍎 App iOS
- 🌐 Carteirinha web (PWA)
- 🔐 Autenticação biométrica
- 📈 Dashboard do aluno com analytics

---

## 12. Segurança

### 12.1. Medidas de Segurança

**Autenticação:**
- JWT token obrigatório para acessar endpoints
- Token com expiração de 24 horas
- Refresh token para renovação

**QR Code:**
- Hash SHA-256 para validação
- Timestamp dinâmico (prevenir cópia)
- Validação server-side obrigatória

**PDF:**
- Marca d'água invisível com dados criptografados
- Proteção contra cópia (optional)
- PDF/A para preservação

**App Mobile:**
- FLAG_SECURE (prevenir screenshots)
- Root detection (opcional)
- SSL Pinning para API

---

### 12.2. Validação Presencial

**Fluxo de Validação:**
```
1. Aluno exibe QR Code no app
2. Secretaria escaneia com scanner ou app
3. App envia para: POST /api/carteirinhas/validar
4. Backend valida:
   ├─ Hash correto?
   ├─ Carteirinha ativa?
   ├─ Dentro da validade?
   └─ CPF corresponde?
5. Retorna resultado: VÁLIDA ou INVÁLIDA
6. App exibe resultado visual (verde/vermelho)
```

---

## 🎓 Conclusão

O sistema de Carteirinha Virtual é um componente **essencial** para o SIGE, proporcionando:

✅ **Automatização:** Geração e envio automático  
✅ **Conveniência:** Acessível via email e app  
✅ **Segurança:** QR Code e validação server-side  
✅ **Mobilidade:** App Android offline  
✅ **Escalabilidade:** Pronto para crescer

**Status Atual:** 🚧 **PLANEJADO - Implementação Futura**

---

**Versão do Documento:** 1.0  
**Última Atualização:** Março de 2024  
**Sistema:** SIGE v1.0
