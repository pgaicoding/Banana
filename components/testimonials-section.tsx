import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Digital Artist',
    content: 'Nano Banana has completely transformed my workflow. The multi-image editing capability is a game-changer!',
    rating: 5,
    avatar: '/diverse-woman-avatar.png',
  },
  {
    name: 'Michael Chen',
    role: 'Content Creator',
    content: 'The natural language processing is incredibly intuitive. I can describe what I want and it just works.',
    rating: 5,
    avatar: '/man-avatar.png',
  },
  {
    name: 'Emma Williams',
    role: 'Marketing Manager',
    content: 'Our team productivity has increased 10x. The batch processing feature saves us hours every week.',
    rating: 5,
    avatar: '/professional-woman.png',
  },
  {
    name: 'David Park',
    role: 'Photographer',
    content: 'Best AI image editor I have used. The quality is outstanding and it preserves the original character perfectly.',
    rating: 5,
    avatar: '/photographer.png',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            What Users Say
          </h2>
          <p className="text-balance text-muted-foreground">
            Join thousands of satisfied creators worldwide
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-yellow-200 p-6 dark:border-yellow-900">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
