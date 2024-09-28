import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateNamesPrompt } from '../../promptTemplate';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const debugMode = searchParams.get('debug') === 'true';
    
    const openAIKey = req.headers.get('X-OpenAI-Key') || process.env.OPENAI_API_KEY;

    if (!openAIKey) {
      console.error('OpenAI API key not provided');
      return NextResponse.json({ error: 'OpenAI API key not provided' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: openAIKey,
    });

    const body = await req.json();
    const { attributes, keyMessages, values, stories, vision, tagline, industry } = body;

    const prompt = generateNamesPrompt(industry, attributes, keyMessages, values, stories, vision, tagline);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are a creative naming assistant. Generate company names as requested, following the specified format.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI Raw Response:', content);

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const categories = content.split('\n\n');
    console.log('Split Categories:', categories);

    const namesByCategory: Record<string, string[]> = {};
    categories.forEach(category => {
      const lines = category.split('\n');
      const categoryName = lines[0].replace(':', '').trim();
      const names = lines.slice(1).map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(name => name !== '');
      namesByCategory[categoryName] = names;
      console.log(`Parsed ${categoryName}:`, names);
    });

    console.log('Final Parsed Names:', namesByCategory);

    const response: any = { names: namesByCategory };
    if (debugMode) {
      response.prompt = prompt;
      response.rawResponse = content;
    }
    console.log('Final Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in generate-names API:', error);
    let errorMessage = 'An unexpected error occurred';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate names', 
        message: errorMessage,
        details: errorDetails
      }, 
      { status: 500 }
    );
  }
}