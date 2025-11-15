'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload, ImageIcon, Sparkles, Loader2 } from 'lucide-react'

export function ImageEditor() {
  const [images, setImages] = useState<File[]>([])
  const [prompt, setPrompt] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )
    setImages(prev => [...prev, ...files])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(prev => [...prev, ...files])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Convert image File to base64 data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleGenerate = async () => {
    // Validation
    if (images.length === 0) {
      setError('Please upload at least one image')
      return
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedResult(null)

    try {
      // Convert first image to base64 data URL
      const imageDataURL = await fileToDataURL(images[0])

      // Call API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          imageUrl: imageDataURL
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      // Use the generated image if available, otherwise use the text result
      setGeneratedResult(data.image || data.result)
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to generate. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Try The AI Editor
          </h2>
          <p className="text-balance text-muted-foreground">
            Experience the power of nano-banana&apos;s natural language image editing. Transform any photo with simple text commands
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prompt Engine */}
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 dark:border-yellow-900 dark:from-yellow-950 dark:to-amber-950">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-foreground">Prompt Engine</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-500 hover:to-amber-600">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Image to Image
                </Button>
                <Button variant="outline" className="flex-1">
                  Text to Image
                </Button>
              </div>

              {/* Multi-image upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                  isDragging
                    ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                    : 'border-border bg-muted/20'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {images.length === 0 ? (
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Add Images</p>
                    <p className="text-xs text-muted-foreground">Max 50MB per image</p>
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-3 gap-2 p-4">
                    {images.map((file, index) => (
                      <div key={index} className="group relative aspect-square">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-destructive px-2 py-1 text-xs text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Main Prompt
                </label>
                <Textarea
                  placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-500 hover:to-amber-600"
                onClick={handleGenerate}
                disabled={isGenerating || images.length === 0 || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Now
                  </>
                )}
              </Button>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>
          </Card>

          {/* Output Gallery */}
          <Card className="border-yellow-200 bg-background p-6 dark:border-yellow-900">
            <div className="mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-foreground">Output Gallery</h3>
            </div>

            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-muted/20">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-16 w-16 animate-spin text-yellow-600 dark:text-yellow-400" />
                  <p className="mb-1 text-sm font-medium text-foreground">
                    Generating with AI...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This may take a few moments
                  </p>
                </div>
              ) : generatedResult ? (
                <div className="w-full p-4">
                  {/* Check if result is an image (base64 data URL) or text */}
                  {generatedResult.startsWith('data:image') ? (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={generatedResult}
                        alt="Generated result"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-md">
                      <h4 className="mb-2 font-semibold text-foreground">AI Response:</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{generatedResult}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => setGeneratedResult(null)}
                    variant="outline"
                    className="mt-4"
                  >
                    Generate Another
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    Ready for instant generation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload an image and enter your prompt to begin
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
