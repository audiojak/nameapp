export const generateNamesPrompt = (
  industry: string,
  attributes: string[],
  keyMessages: string[],
  values: string[],
  stories: string[],
  vision: string[],
  tagline: string[]
) => {
  const formatField = (field: string[], label: string) => 
    `${label}:\n${field.map(item => `- ${item}`).join('\n')}`;

  return `Generate company names based on the following communications framework:

Industry: ${industry}

${formatField(attributes, 'Attributes')}

${formatField(keyMessages, 'Key Messages')}

${formatField(values, 'Values')}

${formatField(stories, 'Stories')}

${formatField(vision, 'Vision')}

${formatField(tagline, 'Tagline')}

Attributes of a brand are more practical than the values and focus on things that will make the product better than competitors. Look for attributes that work as a promise to customers. Example: Uniqlo products promise you understated value.
Relevant questions:
What pain do you solve for customers?
How are your products different to your competitors?

Key Messages are the most prosaic part of the communications framework. Key messages convey your brand attributes in language that meets consumers where they are now and gently leads them to where you want them to be. For example, Apple's iWork key messages include descriptions of documents you can create. These key messages are much less sexy than the meaning-of-life iPhone marketing but they convey a much more practical benefit to a cynical audience.
Relevant questions:
How do you make your offering safe for people to say yes to?
If you had to describe your products to your mum then what would you say?

Values of a brand are also framed in terms of the things that the tribe of the brand believes in. This means the owner, future employees, distributors, customers and suppliers. Ask yourself what values you wouldn't go without. But only include ones that are different from your competitors; integrity, innovation and teamwork are just feel-good values. Example: Waitrose cares about "calm, refined ambience."
Relevant questions:
What are the things that you wouldn't give up?
What would an employee have to believe in for you to think they were a good fit?

Stories are the most emotional part of the communications framework. They should be real stories that the owner, future employees, distributors, customers and suppliers would tell. 
Relevant questions:
What are the anecdotes that people tell about you?
Are there any unexpected challenges that you've overcome?

Vision for a brand needs to be framed in terms of the difference that you make in your customer's lives. Aim for a short punchy statement about why you exist. This is not your tagline so don't wordsmith it too much. Aim for genuine and authentic. Two slightly contrasting words are often a nice way to summarise the vision. Example: BMW's essence is "driving excellence."
Relevant questions: 
What is the impact you want to have in the world?
How would you like to be remembered?

Tagline is is where the brand vision comes to life. Your tagline should convey what you do in simple enough terms that someone can instantly know whether you sell what they're looking for. It needs to address the hidden "So What?" that every customer asks. Example: Nike's tagline is "Just do it."
Relevant questions:
What would you put on the side of a truck to tell people that you sell what they need?
What words would someone google if they were looking for your type of products?

Please provide 8 lists of 10 company names each, categorized as follows:

1. Literal Names: Names that directly describe what the company does or its industry.
2. Descriptive Names: Names that suggest the company's benefits or attributes.
3. Abstract Names: Creative or metaphorical names that capture the essence of the brand.
4. Combination Names: Names that combine two or more words to create a new meaning.
5. Playful Names: Names that are funny, quirky, or have a playful tone.
6. Ambiguous Names: Names that can be interpreted in multiple ways, leaving the audience to decide the meaning.
7. Symbolic Names: Names that use symbols, icons, or emojis to represent the company or its industry.
8. Animal Names: Names that use animals to represent the company or its industry.

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

Combination Names:
1. [Name]
2. [Name]
...

Playful Names:
1. [Name]
2. [Name]
...

Ambiguous Names:
1. [Name]
2. [Name]
...

Symbolic Names:
1. [Name]
2. [Name]
...

Animal Names:
1. [Name]
2. [Name]
...


Ensure all names are unique and relevant to the ${industry} industry.`;
};