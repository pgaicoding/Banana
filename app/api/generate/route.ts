import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://banana.chinadeeplearning.com",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Nano Banana",
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, imageUrl } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ]
    } as any);

    const result = completion.choices[0].message;

    // Log the full response to debug
    console.log('Full API response:', JSON.stringify(completion, null, 2));
    console.log('Message content:', result.content);
    console.log('Message images:', result.images);

    // Extract the generated image from the response
    let generatedImage = null;
    if (result.images && result.images.length > 0) {
      generatedImage = result.images[0].image_url.url;
    }

    return NextResponse.json({
      success: true,
      result: result.content,
      image: generatedImage, // Return the generated image
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error.message
      },
      { status: 500 }
    );
  }
}
