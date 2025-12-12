import { Metadata } from 'next';
import { LandingPageContent } from './components/LandingPageContent';

export const metadata: Metadata = {
  title: 'DengueSP-Gen | Assistente Inteligente sobre Dengue em São Paulo',
  description:
    'Combine dados oficiais e inteligência artificial para entender a situação da dengue em São Paulo. Informação rápida, confiável e acessível.',
  openGraph: {
    title: 'DengueSP-Gen | Assistente Inteligente',
    description: 'Informações sobre dengue em São Paulo via IA',
    type: 'website',
  },
};

export default function LandingPage() {
  return <LandingPageContent />;
}
