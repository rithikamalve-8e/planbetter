import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';

interface FloorPlanAnalysisProps {
  floorPlanId: string;
  imageData: string;
  projectId: string;
  publicAnonKey: string;
  onAnalysisComplete: (analysisId: string, analysis: any) => void;
}

export function FloorPlanAnalysis({
  floorPlanId,
  imageData,
  projectId,
  publicAnonKey,
  onAnalysisComplete,
}: FloorPlanAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [structuralElements, setStructuralElements] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [useDemoMode, setUseDemoMode] = useState(false);

  // Generate mock analysis for demo mode
  const generateMockAnalysis = () => {
    const mockAnalysis = {
      structuralElements: [
        { type: 'Windows', location: 'South-facing wall', sustainabilityImpact: 'high', description: '4 large windows providing excellent natural light' },
        { type: 'Walls', location: 'External walls', sustainabilityImpact: 'medium', description: 'Standard insulation detected' },
        { type: 'Doors', location: 'Main entrance', sustainabilityImpact: 'low', description: 'Single entry point identified' },
        { type: 'Roof', location: 'South-facing slope', sustainabilityImpact: 'high', description: 'Ideal orientation for solar panels' },
      ],
      recommendations: [
        {
          title: 'Install Energy-Efficient Windows',
          description: 'Replace single-pane windows with double-glazed, low-E windows to significantly reduce heat transfer and improve insulation. This upgrade will minimize heating and cooling costs while enhancing comfort.',
          category: 'energy',
          energySavings: '25%',
          co2Reduction: '800 kg/year',
          cost: '₹3,75,000',
          priority: 'high'
        },
        {
          title: 'Add Solar Panels',
          description: 'Install a 5kW solar panel system on the south-facing roof to generate clean renewable energy. This will dramatically reduce your reliance on grid electricity and lower monthly utility bills.',
          category: 'energy',
          energySavings: '40%',
          co2Reduction: '1,500 kg/year',
          cost: '₹10,00,000',
          priority: 'high'
        },
        {
          title: 'Improve Wall Insulation',
          description: 'Upgrade wall insulation to R-20 using eco-friendly cellulose or recycled denim insulation. Better insulation reduces heat loss in winter and heat gain in summer.',
          category: 'energy',
          energySavings: '20%',
          co2Reduction: '600 kg/year',
          cost: '₹2,65,000',
          priority: 'medium'
        },
        {
          title: 'Optimize Natural Lighting',
          description: 'Add skylights and larger windows on the south side to maximize natural daylight. This reduces the need for artificial lighting during the day and creates a healthier living environment.',
          category: 'lighting',
          energySavings: '12%',
          co2Reduction: '300 kg/year',
          cost: '₹2,30,000',
          priority: 'medium'
        },
        {
          title: 'Use Sustainable Flooring',
          description: 'Replace existing flooring with bamboo or reclaimed wood. These materials are renewable, durable, and have a lower environmental impact than traditional hardwood.',
          category: 'materials',
          energySavings: '0%',
          co2Reduction: '200 kg/year',
          cost: '₹4,55,000',
          priority: 'low'
        },
        {
          title: 'Install Smart Thermostat',
          description: 'Add a programmable smart thermostat to optimize heating and cooling schedules. Learn your preferences and automatically adjust temperatures for maximum efficiency.',
          category: 'energy',
          energySavings: '15%',
          co2Reduction: '450 kg/year',
          cost: '₹20,000',
          priority: 'high'
        }
      ],
      overallScore: '72',
      metrics: {
        estimatedEnergySavings: '3,200 kWh',
        estimatedCO2Reduction: '3,850 kg',
        totalCost: '₹23,45,000',
        paybackPeriod: '7 years'
      }
    };

    return mockAnalysis;
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      // Only attempt fetch if we have valid credentials
      if (!projectId || !publicAnonKey || projectId === 'your-project-id') {
        throw new Error('Demo mode - using local data');
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-42ce94c7/analyze-floor-plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            floorPlanId,
            imageData,
            name: 'Floor Plan',
            preferences: 'Focus on energy efficiency and cost-effectiveness',
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Analysis complete!');
        setStructuralElements(data.analysis.structuralElements || []);
        setAnalysisResults(data.analysis);
        setAnalyzed(true);
        onAnalysisComplete(data.analysisId, data.analysis);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      // Silently fall back to demo mode
      toast.info('💡 Using demo mode - showing sample analysis');
      
      setUseDemoMode(true);
      const mockAnalysis = generateMockAnalysis();
      setStructuralElements(mockAnalysis.structuralElements);
      setAnalysisResults(mockAnalysis);
      setAnalyzed(true);
      
      const analysisId = `demo-analysis-${Date.now()}`;
      onAnalysisComplete(analysisId, mockAnalysis);
    } finally {
      setAnalyzing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Setup Alert */}
      {useDemoMode ? (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're viewing sample analysis. Configure your Groq API key in Supabase for AI-powered analysis.
          </AlertDescription>
        </Alert>
      ) : (
        !analyzed && (
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Ready to Analyze</AlertTitle>
            <AlertDescription className="text-blue-700">
              Click "Analyze Floor Plan" to get AI-powered sustainability insights. Demo mode available if backend is unavailable.
            </AlertDescription>
          </Alert>
        )
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Floor Plan Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Floor Plan Canvas</CardTitle>
              <CardDescription>Your uploaded floor plan with detected elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={imageData}
                  alt="Floor plan"
                  className="w-full h-auto"
                />
                
                {/* Overlay for structural elements */}
                {structuralElements.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {structuralElements.map((element, index) => (
                      <div
                        key={index}
                        className="absolute top-4 left-4 pointer-events-auto"
                        style={{ marginTop: `${index * 40}px` }}
                      >
                        <Badge variant="outline" className={getImpactColor(element.sustainabilityImpact)}>
                          {element.type}: {element.location}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analyzed && analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Analysis Results
                </CardTitle>
                <CardDescription>Detected structural elements and sustainability insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Sustainability Score</p>
                      <p className="text-green-900">Good Potential for Improvement</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-700">{analysisResults.overallScore}</div>
                      <p className="text-sm text-gray-600">out of 100</p>
                    </div>
                  </div>
                  <Progress value={parseInt(analysisResults.overallScore)} className="h-2" />
                </div>

                {/* Detected Elements */}
                <div>
                  <h4 className="text-gray-900 mb-3">Detected Structural Elements</h4>
                  <div className="grid gap-3">
                    {structuralElements.map((element, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-900">{element.type}</span>
                          </div>
                          <Badge variant="outline" className={getImpactColor(element.sustainabilityImpact)}>
                            {element.sustainabilityImpact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{element.location}</p>
                        {element.description && (
                          <p className="text-sm text-gray-500 mt-1">{element.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-gray-900 mb-3">Key Insights</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Potential Energy Savings</p>
                      <p className="text-green-700">{analysisResults.metrics.estimatedEnergySavings}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">CO₂ Reduction Potential</p>
                      <p className="text-blue-700">{analysisResults.metrics.estimatedCO2Reduction}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                AI Analysis
              </CardTitle>
              <CardDescription>Get comprehensive sustainability insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!analyzed ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-3">
                      Our AI will analyze your floor plan to identify:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Structural elements and layout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Energy efficiency opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Sustainability improvements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Cost-effective recommendations</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Floor Plan
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">Analysis Complete!</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      We've identified {structuralElements.length} key structural elements and generated {analysisResults.recommendations.length} personalized recommendations.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">Next Steps:</p>
                    <p className="text-sm text-gray-600">
                      View detailed recommendations in the Recommendations tab to start optimizing your floor plan for sustainability.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-sm">Sustainability Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm">Energy Efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm">Natural Lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span className="text-sm">Sustainable Materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  <span className="text-sm">Ventilation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}