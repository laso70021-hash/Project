import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { query, latitude = -6.7924, longitude = 39.2083, locationName = 'Dar es Salaam, Tanzania' } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured',
          details: 'Please configure GEMINI_API_KEY in the Secrets panel.'
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are the GIS Logistics & Route Intelligence Assistant for SWAHIVO Logistics OS in East Africa.
Location Context: ${locationName} (coordinates: ${latitude}, ${longitude}).
User Question: ${query}

Provide accurate, grounded information about the route, highway conditions, checkpoints, distances, and points of interest for cargo transport between cities like Dar es Salaam, Zanzibar, Morogoro, Arusha, Mwanza, Dodoma, Kigali, and Nairobi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          },
        },
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return NextResponse.json({
      text,
      groundingChunks,
    });
  } catch (err: any) {
    console.error('Error in Google Maps Grounding API:', err);
    return NextResponse.json(
      {
        error: 'Failed to generate Maps Grounded response',
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
