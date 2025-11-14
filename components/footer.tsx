export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🍌</span>
              <span className="text-lg font-bold text-foreground">Nano Banana</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform any image with simple text prompts using advanced AI technology.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            Nanobanana.ai is an independent product and is not affiliate with Google or any of its brands
          </p>
          <p className="mt-2">© 2025 Nano Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
