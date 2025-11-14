import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Languages } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20 px-4 py-20 sm:px-6 lg:px-8">
      {/* Banana decorations */}
      <div className="pointer-events-none absolute left-10 top-20 text-6xl opacity-20">
        🍌
      </div>
      <div className="pointer-events-none absolute right-10 top-20 text-6xl opacity-20">
        🍌
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banana/10 px-4 py-2 text-sm text-banana-foreground">
          <Sparkles className="h-4 w-4" />
          The AI model that outperforms Flux Kontext
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Nano Banana
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Transform any image with simple text prompts. Nano-banana&apos;s advanced model delivers consistent character editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90">
            Start Editing
          </Button>
          <Button size="lg" variant="outline">
            View Examples
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-banana" />
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-banana" />
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-banana" />
            <span>Natural language</span>
          </div>
        </div>
      </div>
    </section>
  )
}
