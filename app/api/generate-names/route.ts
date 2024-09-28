import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { attributes, keyMessages, values, stories, vision, tagline, industry } = body;

  const formatField = (field: string[], label: string) => 
    `${label}:\n${field.map(item => `- ${item}`).join('\n')}`;

  const prompt = `Generate 5 unique and creative company names based on the following information:

Industry: ${industry}

${formatField(attributes, 'Attributes')}

${formatField(keyMessages, 'Key Messages')}

${formatField(values, 'Values')}

${formatField(stories, 'Stories')}

${formatField(vision, 'Vision')}

${formatField(tagline, 'Tagline')}

Please provide a list of 5 company names, each on a new line. The names should be relevant to the ${industry} industry.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedNames = completion.choices[0].message.content
      ?.split('\n')
      .filter((name) => name.trim() !== '')
      .slice(0, 5);

    return NextResponse.json({ names: generatedNames });
  } catch (error) {
    console.error('Error generating names:', error);
    return NextResponse.json({ error: 'Failed to generate names' }, { status: 500 });
  }
}