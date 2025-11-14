import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What is Nano Banana?',
    answer: 'Nano Banana is an advanced AI-powered image editing platform that uses natural language processing to transform images. Simply describe what you want, and our AI model will make it happen.',
  },
  {
    question: 'How many images can I upload at once?',
    answer: 'You can upload up to 9 reference images at once for batch processing. Each image can be up to 50MB in size. Our Pro plan supports even larger batches.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support all major image formats including JPG, PNG, WebP, and HEIC. Images are automatically optimized for the best editing results.',
  },
  {
    question: 'How does the pricing work?',
    answer: 'We offer a free tier with limited generations per month. Paid plans start at $9.99/month with unlimited generations and priority processing.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! All images are encrypted in transit and at rest. We never use your images for training without explicit permission, and you can delete your data at any time.',
  },
  {
    question: 'Can I use generated images commercially?',
    answer: 'Yes, all images generated with a paid plan come with commercial usage rights. Free tier images are for personal use only.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-balance text-muted-foreground">
            Everything you need to know about Nano Banana
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-lg border border-yellow-200 bg-background px-6 dark:border-yellow-900"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-yellow-600 hover:no-underline dark:hover:text-yellow-400">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
