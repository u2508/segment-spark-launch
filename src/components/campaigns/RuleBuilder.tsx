
import React, { useState } from 'react';
import { PlusCircle, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface RuleGroup {
  id: string;
  combinator: 'AND' | 'OR';
  rules: Rule[];
}

const RuleBuilder: React.FC = () => {
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([
    {
      id: '1',
      combinator: 'AND',
      rules: [{ id: '1-1', field: 'name', operator: 'contains', value: '' }]
    }
  ]);
  
  const [estimatedAudience, setEstimatedAudience] = useState<number | null>(null);

  const fields = [
    { value: 'name', label: 'Customer Name' },
    { value: 'email', label: 'Email' },
    { value: 'age', label: 'Age' },
    { value: 'location', label: 'Location' },
    { value: 'lastPurchase', label: 'Last Purchase Date' },
    { value: 'totalSpent', label: 'Total Spent' },
    { value: 'purchaseCount', label: 'Purchase Count' },
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does Not Contain' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'between', label: 'Between' },
  ];

  const addRuleGroup = () => {
    setRuleGroups([
      ...ruleGroups,
      {
        id: Date.now().toString(),
        combinator: 'AND',
        rules: [{ id: `${Date.now()}-1`, field: 'name', operator: 'contains', value: '' }]
      }
    ]);
  };

  const removeRuleGroup = (groupId: string) => {
    setRuleGroups(ruleGroups.filter(group => group.id !== groupId));
  };

  const addRule = (groupId: string) => {
    setRuleGroups(ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [
            ...group.rules,
            { id: `${groupId}-${group.rules.length + 1}`, field: 'name', operator: 'contains', value: '' }
          ]
        };
      }
      return group;
    }));
  };

  const removeRule = (groupId: string, ruleId: string) => {
    setRuleGroups(ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return group;
    }));
  };

  const updateRule = (groupId: string, ruleId: string, field: string, value: string) => {
    setRuleGroups(ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.map(rule => {
            if (rule.id === ruleId) {
              return { ...rule, [field]: value };
            }
            return rule;
          })
        };
      }
      return group;
    }));
  };

  const toggleCombinator = (groupId: string) => {
    setRuleGroups(ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          combinator: group.combinator === 'AND' ? 'OR' : 'AND'
        };
      }
      return group;
    }));
  };

  const calculateAudience = () => {
    // This would typically call an API to get the actual count
    // For now, we'll simulate it with a random number
    const audienceSize = Math.floor(Math.random() * 10000) + 500;
    setEstimatedAudience(audienceSize);
  };

  return (
    <Card className="shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>Audience Rules</CardTitle>
        <CardDescription>
          Define who should receive this campaign by adding rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ruleGroups.map((group, groupIndex) => (
            <div 
              key={group.id} 
              className="border rounded-lg p-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Rule Group {groupIndex + 1}</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleCombinator(group.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Match {group.combinator}
                  </Button>
                </div>
                
                {ruleGroups.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRuleGroup(group.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {group.rules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Select
                      value={rule.field}
                      onValueChange={(value) => updateRule(group.id, rule.id, 'field', value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={rule.operator}
                      onValueChange={(value) => updateRule(group.id, rule.id, 'operator', value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Value"
                      value={rule.value}
                      onChange={(e) => updateRule(group.id, rule.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRule(group.id, rule.id)}
                      disabled={group.rules.length === 1}
                      className="h-9 w-9 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addRule(group.id)}
                  className="mt-2"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Add Rule
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={addRuleGroup}>
              <PlusCircle className="mr-1 h-4 w-4" /> Add Rule Group
            </Button>
            
            <Button onClick={calculateAudience}>
              Calculate Audience Size
            </Button>
          </div>
          
          {estimatedAudience !== null && (
            <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between mt-4">
              <div>
                <h4 className="font-medium">Estimated Audience Size</h4>
                <p className="text-sm text-muted-foreground">Based on your current rules</p>
              </div>
              <Badge className="text-lg bg-primary/20 hover:bg-primary/30 text-primary py-2">
                {estimatedAudience.toLocaleString()} customers
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleBuilder;
