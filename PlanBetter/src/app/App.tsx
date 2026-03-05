import React, { useState } from 'react';
import { Leaf, Home, BarChart3, FileText } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LandingPage } from './components/LandingPage';
import { FloorPlanUpload } from './components/FloorPlanUpload';
import { FloorPlanAnalysis } from './components/FloorPlanAnalysis';
import { RecommendationDashboard } from './components/RecommendationDashboard';
import { ReportsExport } from './components/ReportsExport';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

type AppView = 'landing' | 'upload' | 'analysis' | 'recommendations' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentView('upload');
  };

  const handleUploadComplete = (id: string, data: string) => {
    setFloorPlanId(id);
    setImageData(data);
    setCurrentView('analysis');
  };

  const handleAnalysisComplete = (id: string, data: any) => {
    setAnalysisId(id);
    setAnalysisData(data);
    setCurrentView('recommendations');
  };

  const handleViewReports = () => {
    setCurrentView('reports');
  };

  const handleBackToDashboard = () => {
    setCurrentView('recommendations');
  };

  const handleStartOver = () => {
    setCurrentView('landing');
    setFloorPlanId(null);
    setImageData(null);
    setAnalysisId(null);
    setAnalysisData(null);
  };

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">PlanBetter</h1>
                <p className="text-sm text-gray-600">AI-Powered Sustainability Design</p>
              </div>
            </div>

            <button
              onClick={handleStartOver}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {currentView !== 'upload' && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Tabs value={currentView} className="w-full">
              <TabsList className="grid w-full max-w-2xl grid-cols-3 h-auto">
                <TabsTrigger
                  value="analysis"
                  onClick={() => imageData && setCurrentView('analysis')}
                  disabled={!imageData}
                  className="flex items-center gap-2 py-3"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Analysis</span>
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  onClick={() => analysisData && setCurrentView('recommendations')}
                  disabled={!analysisData}
                  className="flex items-center gap-2 py-3"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Recommendations</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  onClick={() => analysisData && setCurrentView('reports')}
                  disabled={!analysisData}
                  className="flex items-center gap-2 py-3"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="mb-2 text-gray-900">Upload Your Floor Plan</h2>
              <p className="text-gray-600">
                Start by uploading your architectural drawings to get AI-powered sustainability recommendations
              </p>
            </div>
            <FloorPlanUpload
              onUploadComplete={handleUploadComplete}
              projectId={projectId}
              publicAnonKey={publicAnonKey}
            />
          </div>
        )}

        {currentView === 'analysis' && floorPlanId && imageData && (
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-gray-900">Floor Plan Analysis</h2>
              <p className="text-gray-600">
                Review your floor plan and tell us your preferences for personalized recommendations
              </p>
            </div>
            <FloorPlanAnalysis
              floorPlanId={floorPlanId}
              imageData={imageData}
              projectId={projectId}
              publicAnonKey={publicAnonKey}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {currentView === 'recommendations' && analysisId && analysisData && (
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-gray-900">Sustainability Recommendations</h2>
              <p className="text-gray-600">
                Review and select recommendations to optimize your floor plan for sustainability
              </p>
            </div>
            <RecommendationDashboard
              analysisId={analysisId}
              analysis={analysisData}
              projectId={projectId}
              publicAnonKey={publicAnonKey}
              onViewReports={handleViewReports}
            />
          </div>
        )}

        {currentView === 'reports' && analysisId && analysisData && floorPlanId && (
          <ReportsExport
            analysisId={analysisId}
            analysis={analysisData}
            floorPlanId={floorPlanId}
            projectId={projectId}
            publicAnonKey={publicAnonKey}
            onBack={handleBackToDashboard}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-sm">
                Powered by AI • Building a Sustainable Future
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-green-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
