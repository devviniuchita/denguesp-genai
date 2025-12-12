"use client";

import { InitiateChatButton } from "@/app/(home)/components/InitiateChatButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
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
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function ComoFuncionaContent() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-40 transition-all duration-300"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
            title="Voltar para a página inicial"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12 lg:py-16 max-w-5xl">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16 text-center md:text-left"
        >
          <motion.div variants={itemVariants}>
            <Link href="/" className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 hover:bg-primary/20 transition-all hover:scale-110">
              <Bot className="h-8 w-8 text-primary" />
            </Link>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Entenda como o DengueSP-GenAI funciona
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            O DengueSP-GenAI é um assistente conversacional especializado em
            dengue na cidade de São Paulo. Ele combina dados oficiais em tempo
            quase real com IA Generativa para responder, em linguagem simples,
            perguntas como:
          </motion.p>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl">
            {[
              "Como está a dengue esta semana em São Paulo?",
              "Quais são os principais sintomas de dengue?",
              "Quando devo me preocupar e procurar um serviço de saúde?",
              "O número de casos está aumentando ou diminuindo?",
            ].map((question) => (
              <motion.div
                key={question}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 text-primary/70 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground/80">
                  {question}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-lg text-muted-foreground">
            Tudo isso em uma interface de chat estilo WhatsApp, enquanto toda a
            inteligência acontece nos bastidores.
          </motion.p>
        </motion.section>

        {/* Diferenciais */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-20"
        >
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              Por que o DengueSP-GenAI é diferente
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Enquanto a maior parte das informações sobre dengue está espalhada
              em boletins, PDFs e notícias, o DengueSP-GenAI junta tudo isso em um
              único ponto de contato inteligente:
            </motion.p>

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
              ].map((item) => (
                <motion.div
                  key={item.text}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col gap-4 p-5 bg-background/50 dark:bg-black/20 rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="p-2.5 bg-primary/10 w-fit rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p variants={itemVariants} className="mt-8 text-lg font-medium text-center text-primary">
              O resultado é um agente que responde de forma clara, responsável e
              baseada em fontes confiáveis.
            </motion.p>
          </div>
        </motion.section>

        {/* Como Funciona - Steps */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-center">
            Como funciona – passo a passo
          </motion.h2>
          <motion.p variants={itemVariants} className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Por trás de uma interface simples de chat, o DengueSP-GenAI orquestra
            um pipeline de dados oficiais, IA Generativa e guardrails de
            segurança para entregar respostas claras e responsáveis sobre
            dengue.
          </motion.p>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/50 dark:bg-white/5 border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
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
                  <code className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary font-bold">
                    /chat
                  </code>
                  {"."}
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/50 dark:bg-white/5 border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
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
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/50 dark:bg-white/5 border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
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
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <p className="font-semibold text-sm mb-1 text-primary">
                      Base Epidemiológica
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alimentada com semanas da API InfoDengue. Processada com
                      Python + Pandas para gerar resumos semana a semana.
                    </p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <p className="font-semibold text-sm mb-1 text-primary">Base Educativa</p>
                    <p className="text-xs text-muted-foreground">
                      Trechos de documentos oficiais (sintomas, prevenção)
                      indexados em um banco vetorial FAISS/Chroma.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/50 dark:bg-white/5 border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
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
                <p className="text-sm font-medium text-primary bg-primary/10 p-2 rounded-lg inline-block">
                  A resposta é enviada ao frontend e exibida em bolhas no chat.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Dados e Segurança Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-8 mb-20"
        >
          {/* De onde vêm os dados */}
          <motion.section variants={itemVariants} className="bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-border/50 shadow-lg shadow-primary/5 hover:border-primary/30 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              De onde vêm os dados
            </h2>
            <p className="text-muted-foreground mb-6">
              Para entregar respostas confiáveis, o DengueSP-GenAI se baseia em
              três pilares:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0 animate-pulse" />
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
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0 animate-pulse" />
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
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0 animate-pulse" />
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
          </motion.section>

          {/* Segurança */}
          <motion.section variants={itemVariants} className="bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-md rounded-3xl p-8 border border-blue-100 dark:border-blue-900/50 shadow-lg shadow-blue-500/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900 dark:text-blue-100">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Segurança e Responsabilidade
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              O DengueSP-GenAI foi projetado para ser útil, mas também seguro. O
              foco é informar e educar, nunca substituir profissionais.
            </p>
            <ul className="space-y-3">
              {[
                "Não substitui médicos ou serviços de saúde.",
                "Não confirma diagnósticos individuais.",
                "Não indica medicamentos ou doses.",
                "Sempre incentiva buscar atendimento profissional.",
                "Responde apenas sobre dengue e somente com base em dados e documentos oficiais fornecidos pelo sistema.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-blue-800 dark:text-blue-200 text-sm font-medium"
                >
                  <Shield className="h-4 w-4 shrink-0 opacity-70" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>
        </motion.div>

        {/* Público e Futuro */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              Para quem estamos construindo
            </motion.h2>
            <motion.ul variants={containerVariants} className="space-y-4">
              {[
                "Cidadãos que querem entender melhor o risco de dengue em São Paulo.",
                "Estudantes e educadores, como apoio em projetos e conscientização.",
                "Profissionais de comunicação, transformando dados em mensagens claras.",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 p-4 bg-white/50 dark:bg-white/5 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm transition-all"
                >
                  <div className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              Próximos passos
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
              Estamos começando pelo essencial. A partir dessa base, o
              DengueSP-GenAI pode crescer para:
            </motion.p>
            <motion.div variants={containerVariants} className="space-y-3">
              {[
                "Enviar alertas proativos quando o risco aumentar.",
                "Oferecer dashboards simplificados para gestores.",
                "Integrar outros municípios e dados climáticos.",
              ].map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="h-px w-4 bg-primary/50" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
            <motion.p variants={itemVariants} className="mt-6 text-sm font-medium text-primary">
              Cada conversa ajuda a transformar dados em ações contra a dengue.
            </motion.p>
          </motion.section>
        </div>

        {/* CTA Final */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="text-center py-12 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 transform scale-150"></div>
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">Pronto para testar?</motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experimente agora mesmo o DengueSP-GenAI e tire suas dúvidas sobre a
            situação da dengue em São Paulo.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center" whileHover={{ scale: 1.05 }}>
            <InitiateChatButton />
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-md mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='h-6 w-6 rounded bg-primary/20 flex items-center justify-center'>
                <span className='text-xs font-bold text-primary'>D</span>
              </div>
              <span className='font-semibold'>DengueSP-GenAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 DengueSP-GenAI. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href='/privacidade' className='hover:text-foreground transition-colors'>
                Privacidade
              </Link>
              <Link href='/termos' className='hover:text-foreground transition-colors'>
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
