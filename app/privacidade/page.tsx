import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Clock, Lock, Mail, Shield } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | DengueSP-GenAI",
  description: "Política de Privacidade e Proteção de Dados da plataforma DengueSP-GenAI. Compreenda como seus dados são protegidos.",
  openGraph: {
    title: "Política de Privacidade | DengueSP-GenAI",
    description: "Política de Privacidade e Proteção de Dados da plataforma DengueSP-GenAI",
    type: "website",
  },
};

const privacyData = [
  {
    id: "coleta",
    title: "Informações que Coletamos",
    content: `Coletamos informações que você fornece voluntariamente, como nome, email e histórico de interações com nosso chatbot. Também coletamos informações automaticamente, como endereço IP, tipo de navegador e páginas visitadas.`,
  },
  {
    id: "uso",
    title: "Como Usamos Seus Dados",
    content: `Usamos suas informações para melhorar nossos serviços, personalizar sua experiência, enviar comunicações relevantes sobre dengue e validar sua identidade. Nunca vendemos suas informações para terceiros.`,
  },
  {
    id: "seguranca",
    title: "Segurança de Dados",
    content: `Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração e divulgação. Utilizamos criptografia SSL/TLS para transmissão segura de dados.`,
  },
  {
    id: "direitos",
    title: "Seus Direitos (LGPD/GDPR)",
    content: `Você tem o direito de acessar, corrigir ou deletar seus dados pessoais. Também pode revogar seu consentimento a qualquer momento. Para exercer seus direitos, entre em contato através do email de privacidade.`,
  },
  {
    id: "cookies",
    title: "Cookies & Rastreamento",
    content: `Usamos cookies e tecnologias similares para melhorar sua experiência de navegação e entender como você usa nossa plataforma. Você pode controlar essas configurações em seu navegador.`,
  },
  {
    id: "retencao",
    title: "Retenção de Dados",
    content: `Retemos seus dados pessoais enquanto sua conta está ativa ou conforme necessário para fornecer nossos serviços. Dados podem ser retidos mais tempo se exigido por lei ou para fins legítimos.`,
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
            title="Voltar para a página inicial"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 lg:py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Política de Privacidade
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Conheça como protegemos e gerenciamos seus dados pessoais na plataforma DengueSP-GenAI.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Última atualização: 22 de Novembro de 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-muted/50 rounded-lg p-6 mb-12 border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Navegação Rápida
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-label="Navegação de seções">
            {privacyData.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 py-2 px-3 rounded-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                → {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <section className="space-y-8" aria-label="Conteúdo das políticas de privacidade">
          {privacyData.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="border rounded-lg p-6 transition-all duration-300 hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/50"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {section.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </section>

        {/* LGPD/GDPR Compliance Section */}
        <div className="mt-12 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg transition-all duration-300 hover:shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <Lock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 uppercase tracking-wide">
              Conformidade LGPD & GDPR
            </h3>
          </div>
          <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed mb-3">
            Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD - Brasil) e o Regulamento Geral de Proteção de Dados (GDPR - Europa). Seus direitos e privacidade são nossa prioridade. Para questões de privacidade, entre em contato com nosso Encarregado de Proteção de Dados (DPO).
          </p>
          <p className="text-sm text-green-800 dark:text-green-200">
            Para mais informações:{" "}
            <a
              href="https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 dark:text-green-300 font-medium underline hover:text-green-600 dark:hover:text-green-100 transition-colors"
            >
              LGPD - Portal Gov.br
            </a>
            {" | "}
            <a
              href="https://gdpr.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 dark:text-green-300 font-medium underline hover:text-green-600 dark:hover:text-green-100 transition-colors"
            >
              GDPR - Regulamento Europeu
            </a>
          </p>
        </div>

        {/* Dúvidas e Fontes de Dados */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-all duration-300 hover:shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
              Dúvidas e Fontes de Dados
            </h3>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed mb-4">
            Para dúvidas sobre dengue, notificações e informações de saúde, entre em contato com os órgãos oficiais:
          </p>

          <div className="space-y-3">
            {/* Secretaria Municipal */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-blue-900 dark:text-blue-100">Secretaria Municipal de Saúde de SP:</span>
              <a
                href="https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                prefeitura.sp.gov.br
              </a>
            </div>

            {/* Secretaria Estadual */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-blue-900 dark:text-blue-100">Secretaria Estadual de Saúde (CVE):</span>
              <a
                href="https://www.saude.sp.gov.br/cve-centro-de-vigilancia-epidemiologica-prof.-alexandre-vranjac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                saude.sp.gov.br/cve
              </a>
            </div>

            {/* Notificações */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-blue-900 dark:text-blue-100">Notificações epidemiológicas:</span>
              <a
                href="mailto:notifica@saude.sp.gov.br"
                className="text-primary hover:underline"
              >
                notifica@saude.sp.gov.br
              </a>
            </div>

            {/* Ministério da Saúde */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-blue-900 dark:text-blue-100">Ministério da Saúde:</span>
              <a
                href="https://www.gov.br/saude/pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                gov.br/saude
              </a>
            </div>
          </div>

          {/* Fonte de Dados */}
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium text-blue-900 dark:text-blue-100">Dados epidemiológicos obtidos através da API:</span>{" "}
              <a
                href="https://info.dengue.mat.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Info Dengue (info.dengue.mat.br)
              </a>
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Button asChild variant="outline" size="lg" className="w-full transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">
            <Link href="/termos" title="Ir para Termos de Serviço">
              Ler Termos de Serviço
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">
            <Link href="/" title="Voltar para página inicial">
              Voltar ao Início
            </Link>
          </Button>
        </div>

        {/* Last Update Note */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border text-center transition-all duration-300 hover:bg-muted">
          <p className="text-sm text-muted-foreground mb-2 font-medium">
            Alterações nesta política
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente está sempre disponível nesta página.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm mt-16">
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
