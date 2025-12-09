import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Serviço | DengueSP-Gen",
  description: "Termos e condições de uso da plataforma DengueSP-Gen. Leia nossas políticas e regulamentações.",
  openGraph: {
    title: "Termos de Serviço | DengueSP-Gen",
    description: "Termos e condições de uso da plataforma DengueSP-Gen",
    type: "website",
  },
};

const termsData = [
  {
    id: "uso",
    title: "Condições de Uso",
    content: `Ao acessar e usar a plataforma DengueSP-Gen, você concorda em cumprir com estes Termos de Serviço. A plataforma é fornecida "no estado em que se encontra" para fins educacionais e informativos sobre dengue em São Paulo.`,
  },
  {
    id: "propriedade",
    title: "Propriedade Intelectual",
    content: `Todo o conteúdo, incluindo textos, gráficos, logos, imagens e software, é propriedade da DengueSP-Gen ou seus respectivos proprietários. Você concorda em não reproduzir, distribuir ou transmitir qualquer conteúdo sem permissão prévia.`,
  },
  {
    id: "responsabilidades",
    title: "Responsabilidades do Usuário",
    content: `Você é responsável por manter a confidencialidade de suas credenciais de acesso e todas as atividades que ocorrem em sua conta. Você concorda em não usar a plataforma de forma ilegal ou não autorizada.`,
  },
  {
    id: "limitacoes",
    title: "Limitação de Responsabilidade",
    content: `A DengueSP-Gen não será responsável por danos indiretos, incidentais, especiais ou consequentes resultantes do uso ou incapacidade de usar a plataforma. As informações fornecidas são apenas para referência educacional.`,
  },
  {
    id: "modificacoes",
    title: "Modificações dos Termos",
    content: `Reservamos o direito de modificar estes Termos de Serviço a qualquer momento. As mudanças entrarão em vigor imediatamente após a publicação. Seu uso contínuo da plataforma implica em aceitação das modificações.`,
  },
  {
    id: "lei",
    title: "Lei Aplicável",
    content: `Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil, especialmente pela Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Qualquer disputa será resolvida nos tribunais competentes do Estado de São Paulo.`,
  },
];

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Termos de Serviço
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Leia e compreenda nossos termos e condições antes de usar a plataforma DengueSP-Gen.
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
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {termsData.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 px-3 rounded-md hover:bg-background"
              >
                → {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {termsData.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="border rounded-lg p-6 transition-all hover:border-primary/50"
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
        </div>

        {/* LGPD Compliance Section */}
        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide mb-3">
            ⚠️ Conformidade com LGPD
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD). Seus dados pessoais são processados com segurança e privacidade. Para mais informações, consulte nossa{" "}
            <Link href="/privacidade" className="font-semibold hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/privacidade">
              Ler Política de Privacidade
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link href="/">
              Voltar ao Início
            </Link>
          </Button>
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Dúvidas ou preocupações sobre estes Termos?
          </p>
          <p className="text-sm font-medium">
            Entre em contato:{" "}
            <a href="mailto:funcaosocial@prefeitura.sp.gov.br" className="text-primary hover:underline">
              funcaosocial@prefeitura.sp.gov.br
            </a>
          </p>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="border-t bg-background/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 DengueSP-Gen. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
