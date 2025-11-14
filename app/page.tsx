import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { ImageEditor } from '@/components/image-editor'
import { ShowcaseSection } from '@/components/showcase-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ImageEditor />
        <ShowcaseSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
