'use client';

import { useState, useEffect } from 'react';
import { Button, VStack, Heading, Text, List, ListItem, HStack, IconButton, Box, UnorderedList, Select, Textarea, Input, useColorModeValue, Tooltip, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaThumbsUp, FaThumbsDown, FaCheckCircle, FaTimesCircle, FaGlobe, FaQuestionCircle } from 'react-icons/fa';
import { testData } from '../testData';

type FormField = 'attributes' | 'keyMessages' | 'values' | 'stories' | 'vision' | 'tagline' | 'excludedWords' | 'interestingWords';

type TestData = {
  // ... existing properties ...
  tagline: string;
  excludedWords: string[];
};

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
  excludedWords: {
    description: 'Words that should not be used in the generated company names.',
    questions: [
      'Are there any words that are overused in your industry?',
      'Are there any words that have negative connotations for your brand?'
    ]
  },
  interestingWords: {
    description: 'Words that could be interesting to include or consider in the generated company names.',
    questions: [
      'What are some unique or compelling words related to your industry or brand?',
      'Are there any words that capture the essence of your company\'s vision or values?'
    ]
  },
};

const industries = [
  'Software', // Added Software as the first item
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
    excludedWords: [''],
    interestingWords: [''],
  });
  const [industry, setIndustry] = useState('Software'); // Set default to 'Software'
  const [generatedNames, setGeneratedNames] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ prompt?: string; response?: string }>({});
  const [openAIKey, setOpenAIKey] = useState('');
  const [isEnvironmentKeyAvailable, setIsEnvironmentKeyAvailable] = useState(true);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [domainAvailability, setDomainAvailability] = useState<Record<string, Record<string, boolean>>>({});
  const [domainDebugInfo, setDomainDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setDebugMode(urlParams.get('debug') === 'true');
  }, []);

  useEffect(() => {
    const checkEnvironmentKey = async () => {
      const response = await fetch('/api/check-openai-key');
      const { isAvailable } = await response.json();
      setIsEnvironmentKeyAvailable(isAvailable);
    };

    checkEnvironmentKey();
  }, []);

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

  const handleNameRejection = (name: string, category: string) => {
    // Add to rejected names
    setRejectedNames(prev => [...prev, name]);

    // Remove from generated names
    setGeneratedNames(prev => {
      const updatedNames = { ...prev };
      updatedNames[category] = updatedNames[category].filter(n => n !== name);
      return updatedNames;
    });
  };

  const generateNames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-names${debugMode ? '?debug=true' : ''}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-OpenAI-Key': !isEnvironmentKeyAvailable ? openAIKey : ''
        },
        body: JSON.stringify({ 
          ...formData, 
          industry, 
          rejectedNames,
          existingNames: isGeneratingMore ? generatedNames : {},
          generateMore: isGeneratingMore
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Raw response text:', text);
      
      let data: {
        names?: Record<string, string[]>;
        prompt?: string;
        rawResponse?: string;
        error?: string;
      };
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('API Response:', data);

      if (data.names && typeof data.names === 'object') {
        console.log('Generated Names:', data.names);
        if (isGeneratingMore) {
          setGeneratedNames(prevNames => {
            const updatedNames = { ...prevNames };
            Object.entries(data.names!).forEach(([category, newNames]) => {
              updatedNames[category] = [...(updatedNames[category] || []), ...newNames];
            });
            return updatedNames;
          });
        } else {
          setGeneratedNames(data.names);
        }
        setIsGeneratingMore(true);
      } else {
        console.error('Unexpected response format:', data);
        setGeneratedNames({});
      }
      if (debugMode) {
        setDebugInfo({ prompt: data.prompt, response: data.rawResponse });
      }
    } catch (error) {
      console.error('Error generating names:', error);
      setGeneratedNames({});
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestData = () => {
    setIndustry(testData.industry);
    setFormData({
      attributes: testData.attributes,
      keyMessages: testData.keyMessages,
      values: testData.values,
      stories: testData.stories,
      vision: testData.vision,
      tagline: testData.tagline,
      excludedWords: testData.excludedWords,
      interestingWords: testData.interestingWords,
    });
  };

  const evenRowBg = useColorModeValue('white', 'gray.800');
  const oddRowBg = useColorModeValue('gray.100', 'gray.700');

  const renderInputs = (field: FormField, label: string) => (
    <VStack align="stretch" key={field} spacing={4} width="100%">
      <Heading size="sm">{label}</Heading>
      <Text fontSize="sm">{fieldDescriptions[field]?.description || ''}</Text>
      <UnorderedList spacing={2} pl={4}>
        {fieldDescriptions[field]?.questions?.map((question, index) => (
          <ListItem key={index}>{question}</ListItem>
        )) || null}
      </UnorderedList>
      {formData[field]?.map((value, index) => (
        <HStack key={`${field}-${index}`} width="100%">
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field, index, e.target.value)}
            placeholder={`${label} ${index + 1}`}
            minHeight="100px"
            width="100%"
          />
          <IconButton
            aria-label="Remove field"
            icon={<DeleteIcon />}
            onClick={() => removeField(field, index)}
            isDisabled={formData[field]?.length === 1}
          />
        </HStack>
      )) || null}
      <Button leftIcon={<AddIcon />} onClick={() => addField(field)} size="sm">
        Add {label}
      </Button>
    </VStack>
  );

  const checkDomainAvailability = async (name: string) => {
    try {
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setDomainAvailability(prev => ({
        ...prev,
        [name]: Object.fromEntries(Object.entries(data).map(([domain, info]) => [domain, (info as any).isAvailable]))
      }));
      setDomainDebugInfo(prev => ({ ...prev, [name]: data }));
    } catch (error) {
      console.error('Error checking domain availability:', error);
    }
  };

  const renderName = (name: string, index: number, category: string) => (
    <ListItem 
      key={index}
      bg={index % 2 === 0 ? evenRowBg : oddRowBg}
      p={3}
      borderRadius="md"
      mb={2}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      <VStack align="stretch" spacing={2}>
        <HStack spacing={4} alignItems="center" justifyContent="space-between">
          <Text fontSize="lg" flex={1}>{name}</Text>
          <HStack spacing={2}>
            {domainAvailability[name] && (
              <HStack>
                {['.com', '.ai', '.io'].map(domain => (
                  <Tooltip key={domain} label={`${name}${domain} is ${domainAvailability[name][domain] ? 'potentially available' : 'likely taken'}`}>
                    <Box>
                      {domainAvailability[name][domain] ? (
                        <FaCheckCircle color="green" />
                      ) : (
                        <FaTimesCircle color="red" />
                      )}
                      <Text fontSize="xs">{domain}</Text>
                    </Box>
                  </Tooltip>
                ))}
              </HStack>
            )}
            <IconButton
              aria-label="Check domain"
              icon={<FaGlobe />}
              size="md"
              fontSize="20px"
              colorScheme="blue"
              onClick={() => checkDomainAvailability(name)}
            />
            <IconButton
              aria-label="Dislike name"
              icon={<FaThumbsDown />}
              size="md"
              fontSize="20px"
              colorScheme="red"
              onClick={() => handleNameRejection(name, category)}
            />
          </HStack>
        </HStack>
        {domainDebugInfo[name] && (
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Domain Check Debug Info
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={2}>
                  {Object.entries(domainDebugInfo[name]).map(([domain, info]) => (
                    <Box key={domain}>
                      <Text fontWeight="bold">{domain}</Text>
                      <Text>Status: {(info as any).statusCode}</Text>
                      <Text>Is Potentially Available: {String((info as any).isAvailable)}</Text>
                      <Text>Error: {(info as any).error || 'None'}</Text>
                    </Box>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </VStack>
    </ListItem>
  );

  return (
    <VStack spacing={12} align="stretch" width="100%" maxWidth="1000px" margin="auto" p={4}>
      <Heading>Company Name Generator</Heading>
      {!isEnvironmentKeyAvailable && (
        <Box width="100%">
          <Text mb={2}>OpenAI API Key:</Text>
          <Input
            type="password"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
            width="100%"
            size="lg"
          />
        </Box>
      )}
      <Button onClick={loadTestData} colorScheme="teal" size="md">
        Load Test Data
      </Button>
      <Box>
        <Heading size="sm">Industry</Heading>
        <Select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          icon={<></>}
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
      <Box>
        {renderInputs('excludedWords', 'Excluded Words')}
      </Box>
      <Box>
        {renderInputs('interestingWords', 'Interesting Words')}
      </Box>
      <Button 
        onClick={generateNames} 
        isLoading={isLoading} 
        colorScheme="blue" 
        size="lg"
      >
        {isGeneratingMore ? "Generate More Names" : "Generate Names"}
      </Button>
      {Object.keys(generatedNames).length > 0 && (
        <>
          <Heading size="md">Generated Names:</Heading>
          {Object.entries(generatedNames).map(([category, names]) => (
            <Box key={category} mt={4}>
              <Heading size="sm" mb={2}>{category}</Heading>
              <List spacing={0}>
                {names.map((name, index) => renderName(name, index, category))}
              </List>
            </Box>
          ))}
        </>
      )}
      {rejectedNames.length > 0 && (
        <Box>
          <Heading size="sm">Rejected Names:</Heading>
          <List spacing={2}>
            {rejectedNames.map((name, index) => (
              <ListItem key={index}>{name}</ListItem>
            ))}
          </List>
        </Box>
      )}
      {debugMode && debugInfo.prompt && (
        <Box width="100%">
          <Heading size="md" mb={4}>Debug Information</Heading>
          <Text fontWeight="bold" mb={2}>Prompt:</Text>
          <Textarea 
            value={debugInfo.prompt} 
            isReadOnly 
            height="300px" 
            width="100%" 
            mb={4}
            fontSize="sm"
            fontFamily="monospace"
          />
          <Text fontWeight="bold" mb={2}>Raw Response:</Text>
          <Textarea 
            value={debugInfo.response} 
            isReadOnly 
            height="300px" 
            width="100%"
            fontSize="sm"
            fontFamily="monospace"
          />
        </Box>
      )}
    </VStack>
  );
};

export default CompanyNameGenerator;