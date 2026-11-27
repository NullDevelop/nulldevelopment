import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { HowWeWork } from '@/components/how-we-work'
import { Portfolio } from '@/components/portfolio'
import { Solutions } from '@/components/solutions'
import { company } from '@/lib/company'
import { siteUrl } from '@/lib/site'

export default function Home() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Null Development',
    url: siteUrl.toString(),
    image: new URL('/Perfil circular.png', siteUrl).toString(),
    email: company.email,
    telephone: '+5541991798306',
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'City', name: 'Campina Grande do Sul' },
      { '@type': 'City', name: 'Quatro Barras' },
      { '@type': 'City', name: 'Colombo' },
      { '@type': 'City', name: 'Pinhais' },
      { '@type': 'City', name: 'Curitiba' },
    ],
    knowsAbout: [
      'Desenvolvimento de software',
      'Sistemas web sob medida',
      'Automação de processos',
      'Integração de sistemas',
    ],
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c'),
        }}
      />
      <Hero />
      <Solutions />
      <HowWeWork />
      <Portfolio />
      <Contact />
      <Footer />
    </main>
  )
}
