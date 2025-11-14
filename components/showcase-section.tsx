import { Card } from '@/components/ui/card'

const showcaseItems = [
  {
    title: 'Portrait Enhancement',
    before: '/portrait-before.png',
    after: '/portrait-after-enhanced.jpg',
  },
  {
    title: 'Scene Transformation',
    before: '/daytime-street.jpg',
    after: '/night-cyberpunk-street.jpg',
  },
  {
    title: 'Style Transfer',
    before: '/photo-realistic-dog.jpg',
    after: '/anime-style-dog.jpg',
  },
  {
    title: 'Object Addition',
    before: '/empty-room.png',
    after: '/furnished-modern-room.jpg',
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="border-b border-border bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Showcase Gallery
          </h2>
          <p className="text-balance text-muted-foreground">
            See what&apos;s possible with Nano Banana&apos;s advanced AI image editing
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden border-yellow-200 dark:border-yellow-900">
              <div className="p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Before</p>
                    <img
                      src={item.before || "/placeholder.svg"}
                      alt={`${item.title} before`}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">After</p>
                    <img
                      src={item.after || "/placeholder.svg"}
                      alt={`${item.title} after`}
                      className="aspect-square w-full rounded-lg object-cover ring-2 ring-yellow-400 dark:ring-yellow-600"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
