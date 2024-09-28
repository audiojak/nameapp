'use client';

import { useState } from 'react';
import { Button, Input, VStack, Heading, Text, List, ListItem, HStack, IconButton, Box, UnorderedList, Select, Textarea } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

type FormField = 'attributes' | 'keyMessages' | 'values' | 'stories' | 'vision' | 'tagline';

const fieldDescriptions: Record<FormField, { description: string; questions: string[] }> = {
  attributes: {
    description: 'The attributes of your brand are more practical than the values and focus on things that will make your product better than your competitors. Look for attributes that work as a promise to your customers. Example: Uniqlo products promise you understated value.',
    questions: [
      'What pain do you solve for customers?',
      'How are your products different to your competitors?'
    ]
  },
  keyMessages: {
    description: 'The key messages are the most prosaic part of your communications framework. Key messages convey your brand attributes in language that meets consumers where they are now and gently leads them to where you want them to be. For example, Apple\'s iWork key messages include descriptions of documents you can create. These key messages are much less sexy than the meaning-of-life iPhone marketing but they convey a much more practical benefit to a cynical audience.',
    questions: [
      'How do you make your offering safe for people to say yes to?',
      'If you had to describe your products to your mum then what would you say?'
    ]
  },
  values: {
    description: 'The **values** of your brand are also framed in terms of the things that your tribe believes in. This means you, your future employees, distributors, customers and suppliers. Ask yourself what values you wouldn\'t go without. But only include ones that are different from your competitors; integrity, innovation and teamwork are just feel-good values. Example: Waitrose cares about "calm, refined ambience."',
    questions: [
      'What are the things that you wouldn\'t give up?',
      'What would an employee have to believe in for you to think they were a good fit?'
    ]
  },
  stories: {
    description: 'Customer Stories that you have gathered from real customers',
    questions: [
      'What are the anecdotes that people tell about you?',
      'Are there any unexpected challenges that you\'ve overcome?'
    ]
  },
  vision: {
    description: 'The **vision** for your brand needs to be framed in terms of the difference that you make in your customer\'s lives. Aim for a short punchy statement about why you exist. This is not your tagline so don\'t wordsmith it too much. Aim for genuine and authentic. Two slightly contrasting words are often a nice way to summarise the vision. Example: BMW\'s essence is "driving excellence."',
    questions: [
      'What is the impact you want to have in the world?',
      'How would you like to be remembered?'
    ]
  },
  tagline: {
    description: 'Your **tagline** is where the brand vision comes to life. Your tagline should convey what you do in simple enough terms that someone can instantly know whether you sell what they\'re looking for. It needs to address the hidden "So What?" that every customer asks. Example: Nike\'s tagline is "Just do it."',
    questions: [
      'What would you put on the side of a truck to tell people that you sell what they need?',
      'What words would someone google if they were looking for your type of products?'
    ]
  },
};

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Entertainment',
  'Food and Beverage', 'Travel and Hospitality', 'Real Estate', 'Energy', 'Automotive', 'Agriculture',
  'Telecommunications', 'Media', 'Fashion', 'Sports', 'Non-Profit', 'Environmental', 'Legal Services',
  'Construction', 'Transportation', 'Aerospace', 'Pharmaceuticals', 'Biotechnology', 'Consulting',
  'Marketing and Advertising', 'Insurance', 'Logistics', 'E-commerce'
];

const CompanyNameGenerator = () => {
  const [formData, setFormData] = useState<Record<FormField, string[]>>({
    attributes: [''],
    keyMessages: [''],
    values: [''],
    stories: [''],
    vision: [''],
    tagline: [''],
  });
  const [industry, setIndustry] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: FormField, index: number, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addField = (field: FormField) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ''],
    }));
  };

  const removeField = (field: FormField, index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const generateNames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, industry }),
      });
      const data = await response.json();
      setGeneratedNames(data.names);
    } catch (error) {
      console.error('Error generating names:', error);
    }
    setIsLoading(false);
  };

  const renderInputs = (field: FormField, label: string) => (
    <VStack align="stretch" key={field} spacing={4}>
      <Heading size="sm">{label}</Heading>
      <Text fontSize="sm">{fieldDescriptions[field].description}</Text>
      <UnorderedList spacing={2} pl={4}>
        {fieldDescriptions[field].questions.map((question, index) => (
          <ListItem key={index}>{question}</ListItem>
        ))}
      </UnorderedList>
      {formData[field].map((value, index) => (
        <HStack key={`${field}-${index}`}>
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field, index, e.target.value)}
            placeholder={`${label} ${index + 1}`}
            minHeight="100px"
          />
          <IconButton
            aria-label="Remove field"
            icon={<DeleteIcon />}
            onClick={() => removeField(field, index)}
            isDisabled={formData[field].length === 1}
          />
        </HStack>
      ))}
      <Button leftIcon={<AddIcon />} onClick={() => addField(field)} size="sm">
        Add {label}
      </Button>
    </VStack>
  );

  return (
    <VStack spacing={12} align="stretch" width="100%" maxWidth="800px" margin="auto" p={4}>
      <Heading>Company Name Generator</Heading>
      <Box>
        <Heading size="sm">Industry</Heading>
        <Select
          placeholder="Select industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        {renderInputs('attributes', 'Attributes')}
      </Box>
      <Box>
        {renderInputs('keyMessages', 'Key Messages')}
      </Box>
      <Box>
        {renderInputs('values', 'Values')}
      </Box>
      <Box>
        {renderInputs('stories', 'Stories')}
      </Box>
      <Box>
        {renderInputs('vision', 'Vision')}
      </Box>
      <Box>
        {renderInputs('tagline', 'Tagline')}
      </Box>
      <Button onClick={generateNames} isLoading={isLoading} colorScheme="blue" size="lg">
        Generate Names
      </Button>
      {generatedNames.length > 0 && (
        <>
          <Heading size="md">Generated Names:</Heading>
          <List spacing={2}>
            {generatedNames.map((name, index) => (
              <ListItem key={index}>{name}</ListItem>
            ))}
          </List>
        </>
      )}
    </VStack>
  );
};

export default CompanyNameGenerator;