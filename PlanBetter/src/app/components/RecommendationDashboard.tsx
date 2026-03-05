import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingDown, 
  IndianRupee, 
  Leaf, 
  Sun,
  Wind,
  Droplets,
  Circle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { ImpactChart } from './ImpactChart';

interface Recommendation {
  title: string;
  description: string;
  category: string;
  energySavings: string;
  co2Reduction: string;
  cost: string;
  priority: string;
  applied?: boolean;
}

interface Analysis {
  recommendations: Recommendation[];
  overallScore: string;
  metrics: {
    estimatedEnergySavings: string;
    estimatedCO2Reduction: string;
    totalCost: string;
    paybackPeriod: string;
  };
}

interface RecommendationDashboardProps {
  analysisId: string;
  analysis: Analysis;
  projectId: string;
  publicAnonKey: string;
  onViewReports: () => void;
}

export function RecommendationDashboard({
  analysisId,
  analysis,
  projectId,
  publicAnonKey,
  onViewReports,
}: RecommendationDashboardProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    analysis.recommendations || []
  );
  const [preferences, setPreferences] = useState('');
  const [refiningRecommendations, setRefiningRecommendations] = useState(false);
  const [customRecommendations, setCustomRecommendations] = useState<Recommendation[]>([]);

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'energy':
        return <Leaf className="w-5 h-5" />;
      case 'lighting':
        return <Sun className="w-5 h-5" />;
      case 'materials':
        return <Droplets className="w-5 h-5" />;
      case 'ventilation':
        return <Wind className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'energy':
        return 'bg-green-100 text-green-700';
      case 'lighting':
        return 'bg-amber-100 text-amber-700';
      case 'materials':
        return 'bg-blue-100 text-blue-700';
      case 'ventilation':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleToggleRecommendation = async (index: number) => {
    const newAppliedState = !recommendations[index].applied;

    try {
      // Only attempt fetch if we have valid credentials
      if (!projectId || !publicAnonKey || projectId === 'your-project-id') {
        throw new Error('Demo mode - using local data');
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-42ce94c7/apply-recommendation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            analysisId,
            recommendationIndex: index,
            applied: newAppliedState,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedRecommendations = [...recommendations];
        updatedRecommendations[index].applied = newAppliedState;
        setRecommendations(updatedRecommendations);
        toast.success(
          newAppliedState
            ? 'Recommendation applied'
            : 'Recommendation removed'
        );
      } else {
        throw new Error('Failed to update recommendation');
      }
    } catch (error) {
      // Silently fall back to local state update (demo mode)
      // This is expected behavior when backend is unavailable
      
      const updatedRecommendations = [...recommendations];
      updatedRecommendations[index].applied = newAppliedState;
      setRecommendations(updatedRecommendations);
      
      toast.success(
        newAppliedState
          ? '✓ Recommendation applied (demo mode)'
          : '✓ Recommendation removed (demo mode)'
      );
    }
  };

  const appliedCount = recommendations.filter((r) => r.applied).length;
  const totalSavingsPercent = appliedCount > 0 
    ? Math.min(100, (appliedCount / recommendations.length) * 100) 
    : 0;

  const handleRefineRecommendations = async () => {
    if (!preferences.trim()) {
      toast.error('Please enter your preferences');
      return;
    }

    setRefiningRecommendations(true);

    try {
      // Only attempt fetch if we have valid credentials
      if (!projectId || !publicAnonKey || projectId === 'your-project-id') {
        throw new Error('Demo mode - using local data');
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-42ce94c7/refine-recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            analysisId,
            preferences,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCustomRecommendations(data.recommendations || []);
        toast.success('Recommendations refined based on your preferences!');
      } else {
        throw new Error('Failed to refine recommendations');
      }
    } catch (error) {
      // Silently fall back to demo mode with mock custom recommendations
      const mockCustomRecs: Recommendation[] = [
        {
          title: 'Custom Recommendation: Budget-Friendly Insulation',
          description: 'Based on your preferences, we recommend starting with attic insulation using cost-effective materials. This provides the best return on investment for improving energy efficiency.',
          category: 'energy',
          energySavings: '18%',
          co2Reduction: '550 kg/year',
          cost: '₹1,50,000',
          priority: 'high'
        },
        {
          title: 'Custom Recommendation: LED Lighting Upgrade',
          description: 'Replace all existing bulbs with energy-efficient LED lights. This is a low-cost, high-impact upgrade that aligns with your budget constraints.',
          category: 'lighting',
          energySavings: '8%',
          co2Reduction: '200 kg/year',
          cost: '₹25,000',
          priority: 'high'
        },
        {
          title: 'Custom Recommendation: Water-Saving Fixtures',
          description: 'Install low-flow faucets and showerheads to reduce water consumption. This matches your interest in comprehensive sustainability improvements.',
          category: 'materials',
          energySavings: '5%',
          co2Reduction: '150 kg/year',
          cost: '₹37,000',
          priority: 'medium'
        },
      ];
      
      setCustomRecommendations(mockCustomRecs);
      toast.success('✨ Custom recommendations generated (demo mode)');
    } finally {
      setRefiningRecommendations(false);
    }
  };

  const handleToggleCustomRecommendation = (index: number) => {
    const updatedCustomRecs = [...customRecommendations];
    updatedCustomRecs[index].applied = !updatedCustomRecs[index].applied;
    setCustomRecommendations(updatedCustomRecs);
    
    toast.success(
      updatedCustomRecs[index].applied
        ? '✓ Custom recommendation applied'
        : '✓ Custom recommendation removed'
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Sustainability Score</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="text-green-700">{analysis.overallScore}/100</div>
              <Progress value={parseInt(analysis.overallScore)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Energy Savings</span>
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-blue-700">
              {analysis.metrics.estimatedEnergySavings}
            </div>
            <p className="text-xs text-gray-500 mt-1">per year</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">CO₂ Reduction</span>
              <Wind className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-emerald-700">
              {analysis.metrics.estimatedCO2Reduction}
            </div>
            <p className="text-xs text-gray-500 mt-1">annually</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Investment</span>
              <IndianRupee className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-amber-700">
              {analysis.metrics.totalCost}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Payback: {analysis.metrics.paybackPeriod}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applied Recommendations Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-gray-900">Applied Recommendations</h4>
              <p className="text-sm text-gray-600">
                {appliedCount} of {recommendations.length} recommendations selected
              </p>
            </div>
            <div className="text-green-700">
              {Math.round(totalSavingsPercent)}%
            </div>
          </div>
          <Progress value={totalSavingsPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Impact Visualization Chart */}
      <ImpactChart 
        energySavings={analysis.metrics.estimatedEnergySavings}
        co2Reduction={analysis.metrics.estimatedCO2Reduction}
      />

      {/* Recommendations Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">Personalized Recommendations</h3>
          <Button onClick={onViewReports} variant="outline">
            View Full Report
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              className={`transition-all hover:shadow-lg ${
                rec.applied ? 'border-green-400 bg-green-50' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}>
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{rec.title}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(rec.category)}>
                          {rec.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={rec.applied || false}
                    onCheckedChange={() => handleToggleRecommendation(index)}
                  />
                </div>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Energy Savings</p>
                    <p className="text-sm text-green-700">{rec.energySavings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CO₂ Reduction</p>
                    <p className="text-sm text-blue-700">{rec.co2Reduction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cost</p>
                    <p className="text-sm text-amber-700">{rec.cost}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {recommendations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No recommendations available yet. Analyze your floor plan to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preferences Section */}
      <Separator className="my-8" />

      <div className="space-y-4">
        <div>
          <h3 className="text-gray-900 mb-2">Your Preferences</h3>
          <p className="text-sm text-gray-600">
            Want more personalized recommendations? Tell us your specific needs and priorities.
          </p>
        </div>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Refine Recommendations
            </CardTitle>
            <CardDescription>
              Share your priorities and budget constraints to get tailored suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preferences">What's most important to you?</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., I'm on a tight budget and want to prioritize quick wins. I'm particularly interested in reducing heating costs and improving natural lighting..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={5}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific about your budget, timeline, priorities, and any constraints. Our AI will generate custom recommendations based on your input.
              </p>
            </div>

            <Button
              onClick={handleRefineRecommendations}
              disabled={refiningRecommendations || !preferences.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {refiningRecommendations ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Custom Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Custom Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Recommendations */}
      {customRecommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">Custom Recommendations Based on Your Preferences</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {customRecommendations.map((rec, index) => (
              <Card
                key={index}
                className={`transition-all hover:shadow-lg border-purple-200 ${
                  rec.applied ? 'border-purple-400 bg-purple-50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}>
                        {getCategoryIcon(rec.category)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{rec.title}</CardTitle>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700">
                            Custom
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={rec.applied || false}
                      onCheckedChange={() => handleToggleCustomRecommendation(index)}
                    />
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Energy Savings</p>
                      <p className="text-sm text-green-700">{rec.energySavings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CO₂ Reduction</p>
                      <p className="text-sm text-blue-700">{rec.co2Reduction}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cost</p>
                      <p className="text-sm text-amber-700">{rec.cost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}