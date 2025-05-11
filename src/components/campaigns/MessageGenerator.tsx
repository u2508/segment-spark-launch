
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Loader2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MessageGeneratorProps {
  campaignName?: string;
  audience?: string;
  onSelectMessage: (message: string) => void;
}

const MessageGenerator: React.FC<MessageGeneratorProps> = ({ 
  campaignName = "My Campaign",
  audience = "loyal customers", 
  onSelectMessage 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses - In a real app, this would call OpenAI API
    const mockSuggestions = [
      `Dear ${audience}, we're excited to announce our latest collection of products designed specifically with you in mind. Check out our exclusive offers and enjoy special discounts as a valued customer.`,
      
      `Thank you for being part of our ${audience} community! We've prepared something special for you - a new line of products that we believe you'll love. Use code SPECIAL10 for an additional 10% off.`,
      
      `As one of our ${audience}, we want to give you early access to our upcoming sale. Mark your calendar for next weekend and be the first to explore our new collection with exclusive pricing just for you.`
    ];
    
    setSuggestions(mockSuggestions);
    setIsGenerating(false);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelectMessage(suggestions[index]);
    
    toast({
      title: "Message selected",
      description: "The message has been added to your campaign.",
    });
  };

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(suggestions[index]);
    setCopiedIndex(index);
    
    toast({
      title: "Copied to clipboard",
      description: "Message has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Message Suggestions
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate smart message content based on your campaign details
          </p>
        </div>
        
        <Button
          onClick={generateSuggestions}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className={`border ${selectedIndex === index ? 'border-primary bg-primary/5' : ''}`}
            >
              <CardContent className="p-4">
                <div className="text-sm mb-3">
                  {suggestion}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(index)}
                    className="text-xs h-8"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="mr-1 h-3 w-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" /> Copy
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSelect(index)}
                    className="text-xs h-8"
                  >
                    Use This Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageGenerator;
