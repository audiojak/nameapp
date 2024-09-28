import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const debugMode = searchParams.get('debug') === 'true';
  
  const openAIKey = req.headers.get('X-OpenAI-Key') || process.env.OPENAI_API_KEY;

  if (!openAIKey) {
    return NextResponse.json({ error: 'OpenAI API key not provided' }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: openAIKey,
  });

  const body = await req.json();
  const { attributes, keyMessages, values, stories, vision, tagline, industry } = body;

  const formatField = (field: string[], label: string) => 
    `${label}:\n${field.map(item => `- ${item}`).join('\n')}`;

  const prompt = `Generate company names based on the following information:

Industry: ${industry}

${formatField(attributes, 'Attributes')}

${formatField(keyMessages, 'Key Messages')}

${formatField(values, 'Values')}

${formatField(stories, 'Stories')}

${formatField(vision, 'Vision')}

${formatField(tagline, 'Tagline')}

Please provide 3 lists of 10 company names each, categorized as follows:

1. Literal Names: Names that directly describe what the company does or its industry.
2. Descriptive Names: Names that suggest the company's benefits or attributes.
3. Abstract Names: Creative or metaphorical names that capture the essence of the brand.

Format your response as follows:

Literal Names:
1. [Name]
2. [Name]
...

Descriptive Names:
1. [Name]
2. [Name]
...

Abstract Names:
1. [Name]
2. [Name]
...

Ensure all names are unique and relevant to the ${industry} industry.`;

  try {
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
    console.log('OpenAI Raw Response:', content); // Log the raw response

    if (content) {
      const categories = content.split('\n\n');
      console.log('Split Categories:', categories); // Log the split categories

      const namesByCategory: Record<string, string[]> = {};
      categories.forEach(category => {
        const lines = category.split('\n');
        const categoryName = lines[0].replace(':', '').trim();
        const names = lines.slice(1).map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(name => name !== '');
        namesByCategory[categoryName] = names;
        console.log(`Parsed ${categoryName}:`, names); // Log each parsed category
      });

      console.log('Final Parsed Names:', namesByCategory); // Log the final parsed names

      const response: any = { names: namesByCategory };
      if (debugMode) {
        response.prompt = prompt;
        response.rawResponse = content;
      }
      console.log('Final Response:', response); // Log the final response
      return NextResponse.json(response);
    }
    
    throw new Error('Unexpected response format from OpenAI');
  } catch (error) {
    console.error('Error generating names:', error);
    return NextResponse.json(
      { error: 'Failed to generate names', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}