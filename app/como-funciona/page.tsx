import { InitiateChatButton } from "@/app/(home)/components/InitiateChatButton";
import {
  Activity,
  ArrowLeft,
  Bot,
  Brain,
  Database,
  FileText,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como Funciona | DengueSP-Gen",
  description:
    "Entenda a arquitetura e o funcionamento do DengueSP-Gen, o assistente conversacional sobre dengue em São Paulo.",
  openGraph: {
    title: "Como Funciona | DengueSP-Gen",
    description: "Entenda a arquitetura e o funcionamento do DengueSP-Gen",
    type: "website",
  },
};

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
            title="Voltar para a página inicial"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 lg:py-16 max-w-5xl">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <Link href="/" className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 hover:bg-primary/20 transition-colors">
            <Bot className="h-8 w-8 text-primary" />
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Entenda como o DengueSP-Gen funciona
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            O DengueSP-Gen é um assistente conversacional especializado em
            dengue na cidade de São Paulo. Ele combina dados oficiais em tempo
            quase real com IA Generativa para responder, em linguagem simples,
            perguntas como:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl">
            {[
              "Como está a dengue esta semana em São Paulo?",
              "Quais são os principais sintomas de dengue?",
              "Quando devo me preocupar e procurar um serviço de saúde?",
              "O número de casos está aumentando ou diminuindo?",
            ].map((question, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <MessageCircle className="h-5 w-5 text-primary/70 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground/80">
                  {question}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-lg text-muted-foreground">
            Tudo isso em uma interface de chat estilo WhatsApp, enquanto toda a
            inteligência acontece nos bastidores.
          </p>
        </section>

        {/* Diferenciais */}
        <section className="mb-20">
          <div className="bg-card border rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              Por que o DengueSP-Gen é diferente
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Enquanto a maior parte das informações sobre dengue está espalhada
              em boletins, PDFs e notícias, o DengueSP-Gen junta tudo isso em um
              único ponto de contato inteligente:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Activity,
                  text: "Dados oficiais da API InfoDengue (Fiocruz + FGV), focados na cidade de São Paulo.",
                },
                {
                  icon: Brain,
                  text: "IA Generativa (Gemini 2.5 Flash) treinada para responder apenas sobre dengue, com regras rígidas.",
                },
                {
                  icon: FileText,
                  text: "Base educativa com orientações oficiais do Ministério da Saúde e OMS/OPAS.",
                },
                {
                  icon: Database,
                  text: "Arquitetura RAG de dupla camada (dados epidemiológicos + conteúdo educativo).",
                },
                {
                  icon: Shield,
                  text: "Guardrails de segurança que impedem o sistema de sair do tema ou dar diagnósticos.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 p-5 bg-background rounded-2xl border hover:border-primary/50 transition-colors"
                >
                  <div className="p-2.5 bg-primary/10 w-fit rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-lg font-medium text-center text-primary">
              O resultado é um agente que responde de forma clara, responsável e
              baseada em fontes confiáveis.
            </p>
          </div>
        </section>

        {/* Como Funciona - Steps */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Como funciona – passo a passo
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Por trás de uma interface simples de chat, o DengueSP-Gen orquestra
            um pipeline de dados oficiais, IA Generativa e guardrails de
            segurança para entregar respostas claras e responsáveis sobre
            dengue.
          </p>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    Você faz uma pergunta no chat
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Na interface estilo WhatsApp, você digita sua dúvida em
                  português, como se estivesse conversando com uma pessoa. O
                  frontend é construído em HTML + Tailwind + JavaScript. A
                  mensagem é enviada para o backend por meio do endpoint{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                    /chat
                  </code>
                  .
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    O backend entende o que você quer saber
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  No backend, feito em FastAPI (Python), acontece a primeira
                  camada de inteligência:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                  <li>Validação da pergunta.</li>
                  <li>Filtro de domínio (somente dengue).</li>
                  <li>
                    Roteamento de intenção:
                    <ul className="pl-4 mt-1 space-y-1 list-disc">
                      <li>
                        <strong>Epidemiológica (EPI):</strong> números de casos,
                        semanas, incidência.
                      </li>
                      <li>
                        <strong>Educativa (EDU):</strong> sintomas, prevenção,
                        sinais de alerta.
                      </li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Perguntas fora do tema dengue são automaticamente rejeitadas
                  com uma mensagem explicando o escopo limitado do assistente.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    O sistema busca a resposta (RAG)
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Aqui entra o RAG (Retrieval-Augmented Generation) com duas
                  bases vetoriais:
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-1">
                      Base Epidemiológica
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alimentada com semanas da API InfoDengue. Processada com
                      Python + Pandas para gerar resumos semana a semana.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-1">Base Educativa</p>
                    <p className="text-xs text-muted-foreground">
                      Trechos de documentos oficiais (sintomas, prevenção)
                      indexados em um banco vetorial FAISS/Chroma.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    A IA Generativa monta a resposta final
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Com o contexto correto, o sistema chama o modelo Gemini 2.5
                  Flash via LangChain, com regras rígidas:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4 mb-3">
                  <li>Responder apenas sobre dengue.</li>
                  <li>Não fazer diagnóstico nem prescrever remédios.</li>
                  <li>
                    Usar somente o contexto recuperado (dados e documentos
                    oficiais fornecidos pelo sistema).
                  </li>
                </ul>
                <p className="text-sm font-medium text-primary">
                  A resposta é enviada ao frontend e exibida em bolhas no chat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dados e Segurança Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* De onde vêm os dados */}
          <section className="bg-muted/30 rounded-3xl p-8 border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              De onde vêm os dados
            </h2>
            <p className="text-muted-foreground mb-6">
              Para entregar respostas confiáveis, o DengueSP-Gen se baseia em
              três pilares:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <strong className="block text-foreground">
                    API InfoDengue
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Dados epidemiológicos oficiais (casos, incidência, nível de
                    alerta).
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <strong className="block text-foreground">
                    Documentos oficiais de saúde
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Guias do Ministério da Saúde e OMS/OPAS.
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <strong className="block text-foreground">
                    Processamento Python + Pandas
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Limpeza e agregação para o mecanismo de RAG.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          {/* Segurança */}
          <section className="bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-900">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900 dark:text-blue-100">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Segurança e Responsabilidade
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              O DengueSP-Gen foi projetado para ser útil, mas também seguro. O
              foco é informar e educar, nunca substituir profissionais.
            </p>
            <ul className="space-y-3">
              {[
                "Não substitui médicos ou serviços de saúde.",
                "Não confirma diagnósticos individuais.",
                "Não indica medicamentos ou doses.",
                "Sempre incentiva buscar atendimento profissional.",
                "Responde apenas sobre dengue e somente com base em dados e documentos oficiais fornecidos ao sistema.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-blue-800 dark:text-blue-200 text-sm font-medium"
                >
                  <Shield className="h-4 w-4 shrink-0 opacity-70" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Público e Futuro */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              Para quem estamos construindo
            </h2>
            <ul className="space-y-4">
              {[
                "Cidadãos que querem entender melhor o risco de dengue em São Paulo.",
                "Estudantes e educadores, como apoio em projetos e conscientização.",
                "Profissionais de comunicação, transformando dados em mensagens claras.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 bg-card border rounded-xl shadow-sm"
                >
                  <div className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              Próximos passos
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos começando pelo essencial. A partir dessa base, o
              DengueSP-Gen pode crescer para:
            </p>
            <div className="space-y-3">
              {[
                "Enviar alertas proativos quando o risco aumentar.",
                "Oferecer dashboards simplificados para gestores.",
                "Integrar outros municípios e dados climáticos.",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="h-px w-4 bg-primary/50" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm font-medium text-primary">
              Cada conversa ajuda a transformar dados em ações contra a dengue.
            </p>
          </section>
        </div>

        {/* CTA Final */}
        <section className="text-center py-12 bg-primary/5 rounded-3xl border border-primary/10">
          <h2 className="text-3xl font-bold mb-4">Pronto para testar?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experimente agora mesmo o DengueSP-Gen e tire suas dúvidas sobre a
            situação da dengue em São Paulo.
          </p>
          <div className="flex justify-center">
            <InitiateChatButton />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='h-6 w-6 rounded bg-primary/20 flex items-center justify-center'>
                <span className='text-xs font-bold text-primary'>D</span>
              </div>
              <span className='font-semibold'>DengueSP-Gen</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 DengueSP-Gen. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href='/privacidade' className='hover:text-foreground'>
                Privacidade
              </a>
              <a href='/termos' className='hover:text-foreground'>
                Termos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
