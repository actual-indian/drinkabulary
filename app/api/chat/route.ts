import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Beer } from '@/types/beer';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, beers } = body as { message: string; beers: Beer[] };


    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const promptPath = path.join(process.cwd(), 'app', 'prompts', 'system-prompt.md');
    const systemPrompt = fs.readFileSync(promptPath, 'utf-8').trim();

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Got it, I will follow the instructions in the system prompt.' }],
        },
      ],
    });

    // Format menu catalog for context with IDs and tags
    const beerCatalog = beers.map(beer => {
      const tags = beer.category && beer.category !== 'Uncategorized'
        ? `${beer.category}${beer.style && beer.style !== 'unknown' && beer.style !== beer.category ? ', ' + beer.style : ''}`
        : (beer.style && beer.style !== 'unknown' ? beer.style : 'No tags');

      return `[ID: ${beer.id}] ${beer.name} - Tags: [${tags}], Price: ${beer.price}`;
    }).join('\n');

    const result = await chat.sendMessage(
      `Available menu items:\n${beerCatalog}\n\nUser message: ${message}`
    );

    let response = result.response.text();

    // Clean up the response to extract pure JSON
    // Remove markdown code blocks if present
    response = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let recommendedBeers: Beer[] = [];

    try {
      // Parse the JSON array from LLM
      const recommendations = JSON.parse(response) as Array<{ id: string; reason: string }>;

      // Match beer IDs with actual beer data and attach reasons
      const matchedBeers: Beer[] = [];
      for (const rec of recommendations) {
        const beer = beers.find(b => b.id === rec.id);
        if (beer) {
          matchedBeers.push({ ...beer, reason: rec.reason });
        }
      }

      recommendedBeers = matchedBeers.slice(0, 2); // Ensure max 2 recommendations

    } catch (error) {
      console.error('Failed to parse LLM response as JSON:', error);
      console.error('Response was:', response);
      // If JSON parsing fails, return empty recommendations
      recommendedBeers = [];
    }

    // Return empty response text since we're only showing beer cards
    return NextResponse.json({ response: '', recommendedBeers });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
