import { Metadata } from "next";
import { ComoFuncionaContent } from "./components/ComoFuncionaContent";

export const metadata: Metadata = {
  title: "Como Funciona | DengueSP-GenAI",
  description:
    "Entenda a arquitetura e o funcionamento do DengueSP-GenAI, o assistente conversacional sobre dengue em São Paulo.",
  openGraph: {
    title: "Como Funciona | DengueSP-GenAI",
    description: "Entenda a arquitetura e o funcionamento do DengueSP-GenAI",
    type: "website",
  },
};

export default function ComoFuncionaPage() {
  return <ComoFuncionaContent />;
}
