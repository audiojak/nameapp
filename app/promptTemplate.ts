export const generateNamesPrompt = (
  industry: string,
  attributes: string[],
  keyMessages: string[],
  values: string[],
  stories: string[],
  vision: string[],
  tagline: string[],
  excludedWords: string[],
  interestingWords: string[],
  rejectedNames: string[],
  existingNames: Record<string, string[]>,
  generateMore: boolean
) => {
  const formatField = (field: string[], label: string) => 
    `${label}:\n${field.map(item => `- ${item}`).join('\n')}`;

  let prompt = `Generate company names based on the following communications framework:

Industry: ${industry}

${formatField(attributes, 'Attributes')}

${formatField(keyMessages, 'Key Messages')}

${formatField(values, 'Values')}

${formatField(stories, 'Stories')}

${formatField(vision, 'Vision')}

${formatField(tagline, 'Tagline')}

Attributes of a brand are more practical than the values and focus on things that will make the product better than competitors. Look for attributes that work as a promise to customers.

Key Messages are the most prosaic part of the communications framework. Key messages convey your brand attributes in language that meets consumers where they are now and gently leads them to where you want them to be.

Values of a brand are also framed in terms of the things that the tribe of the brand believes in.

Stories are the most emotional part of the communications framework. They should be real stories that the owner, future employees, distributors, customers and suppliers would tell. 

Vision for a brand needs to be framed in terms of the difference that you make in your customer's lives. Aim for a short punchy statement about why you exist.

Tagline is where the brand vision comes to life. Your tagline should convey what you do in simple enough terms that someone can instantly know whether you sell what they're looking for.

Excluded Words: These are words that should not be used in the generated company names.
${excludedWords.map(word => `- ${word}`).join('\n')}

Interesting Words: These are words that could be interesting to include or consider in the generated company names.
${interestingWords.map(word => `- ${word}`).join('\n')}

${generateMore ? `Please generate 3 additional names for each category, ensuring they are different from the existing names.` : `Please provide lists of 10 company names for each of the following categories:`}

1. Literal Names: Names that directly describe what the company does or its industry.
2. Descriptive Names: Names that suggest the company's benefits or attributes.
3. Abstract Names: Creative or metaphorical names that capture the essence of the brand.
4. Combination Names: Names that combine two or more words to create a new meaning.
5. Playful Names: Names that are funny, quirky, or have a playful tone.
6. Animal Names: Obscure animal names that are relevant to the company. Just the name of the animal.

Format your response as follows:

[Category] Names:
1. [Name]
2. [Name]
...

Ensure all names are relevant to the ${industry} industry and not the name of a major company. They should be names that have the possibility of not being registered as a domain name. Do not use any of the excluded words in the generated names. Consider incorporating or drawing inspiration from the interesting words when appropriate. Please remove any spaces.`;

  if (rejectedNames.length > 0) {
    prompt += `\n\nPlease avoid the following previously rejected names:
${rejectedNames.map(name => `- ${name}`).join('\n')}`;
  }

  if (generateMore && Object.keys(existingNames).length > 0) {
    prompt += `\n\nExisting names by category:
${Object.entries(existingNames).map(([category, names]) => `${category}:\n${names.map(name => `- ${name}`).join('\n')}`).join('\n\n')}`;
  }

  return prompt;
};