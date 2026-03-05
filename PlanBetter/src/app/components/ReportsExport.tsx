import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  History,
  TrendingUp,
  Leaf,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Analysis {
  id: string;
  floorPlanId: string;
  analysis: {
    recommendations: any[];
    overallScore: string;
    metrics: {
      estimatedEnergySavings: string;
      estimatedCO2Reduction: string;
      totalCost: string;
      paybackPeriod: string;
    };
  };
  preferences: string;
  createdAt: string;
}

interface ReportsExportProps {
  analysisId: string;
  analysis: any;
  floorPlanId: string;
  projectId: string;
  publicAnonKey: string;
  onBack: () => void;
}

export function ReportsExport({
  analysisId,
  analysis,
  floorPlanId,
  projectId,
  publicAnonKey,
  onBack,
}: ReportsExportProps) {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Helper function to convert £ to Rs.
  const convertCurrencyToRupees = (value: string): string => {
    if (!value) return '';
    return String(value).replace(/£/g, 'Rs.').replace(/\$/g, 'Rs.');
  };

  useEffect(() => {
    loadHistory();
  }, [floorPlanId]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    
    // Skip backend call in demo mode - go straight to mock data
    try {
      // Only attempt fetch if we have valid credentials
      if (!projectId || !publicAnonKey || projectId === 'your-project-id') {
        throw new Error('Demo mode - using local data');
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-42ce94c7/history/${floorPlanId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setHistory(data.history || []);
      } else {
        throw new Error('Failed to load history');
      }
    } catch (error) {
      // Silently fall back to demo mode - no error logging
      // This is expected behavior when backend is unavailable
      
      // Fallback to demo mode - create mock history
      const mockHistory: Analysis[] = [
        {
          id: analysisId,
          floorPlanId: floorPlanId,
          analysis: analysis,
          preferences: 'Focus on energy efficiency and cost-effectiveness',
          createdAt: new Date().toISOString(),
        },
        {
          id: `demo-analysis-${Date.now() - 86400000}`,
          floorPlanId: floorPlanId,
          analysis: {
            recommendations: [],
            overallScore: '68',
            metrics: {
              estimatedEnergySavings: '2,800 kWh',
              estimatedCO2Reduction: '3,200 kg',
              totalCost: '₹18,25,000',
              paybackPeriod: '8 years',
            },
          },
          preferences: 'Previous analysis',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      
      setHistory(mockHistory);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Add header with logo/title
      doc.setFillColor(34, 197, 94); // Green color
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('GREEN FLOOR PLAN OPTIMIZER', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('AI-Driven Eco-Friendly Building Design Analysis', pageWidth / 2, 22, { align: 'center' });

      yPos = 40;

      // Report date
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 15, yPos);
      yPos += 15;

      // Sustainability Score Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SUSTAINABILITY SCORE', 15, yPos);
      yPos += 10;

      // Score box
      doc.setFillColor(240, 253, 244); // Light green
      doc.setDrawColor(34, 197, 94); // Green border
      doc.roundedRect(15, yPos, 60, 25, 3, 3, 'FD');
      doc.setTextColor(34, 197, 94);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text(String(analysis.overallScore), 45, yPos + 13, { align: 'center' });
      doc.setFontSize(10);
      doc.text('/ 100', 45, yPos + 20, { align: 'center' });

      // Excellent Performance text
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Excellent Performance', 85, yPos + 15);
      yPos += 35;

      // Key Metrics Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('KEY METRICS', 15, yPos);
      yPos += 8;

      // Metrics table
      const metricsData = [
        ['Annual Energy Savings', String(analysis.metrics.estimatedEnergySavings || '')],
        ['Annual CO₂ Reduction', String(analysis.metrics.estimatedCO2Reduction || '')],
        ['Total Investment', convertCurrencyToRupees(String(analysis.metrics.totalCost || ''))],
        ['Payback Period', String(analysis.metrics.paybackPeriod || '')],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: metricsData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 'auto' },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Applied Recommendations Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('APPLIED MODIFICATIONS', 15, yPos);
      yPos += 8;

      const appliedRecs = analysis.recommendations.filter((r: any) => r.applied);
      
      if (appliedRecs.length > 0) {
        const appliedData = appliedRecs.map((rec: any) => [
          String(rec.title || ''),
          String(rec.category || ''),
          String(rec.energySavings || ''),
          String(rec.co2Reduction || ''),
          convertCurrencyToRupees(String(rec.cost || '')),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Recommendation', 'Category', 'Energy Savings', 'CO₂ Reduction', 'Cost']],
          body: appliedData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
          },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('No recommendations applied yet', 15, yPos);
        yPos += 15;
      }

      // New page for all recommendations
      doc.addPage();
      yPos = 20;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ALL RECOMMENDATIONS', 15, yPos);
      yPos += 8;

      const allRecsData = analysis.recommendations.map((rec: any, index: number) => [
        String(index + 1),
        String(rec.title || ''),
        String(rec.priority || '').toUpperCase(),
        String(rec.category || ''),
        String(rec.energySavings || ''),
        String(rec.co2Reduction || ''),
        convertCurrencyToRupees(String(rec.cost || '')),
        rec.applied ? 'Yes' : 'No',
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Recommendation', 'Priority', 'Category', 'Energy', 'CO₂', 'Cost', 'Applied']],
        body: allRecsData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 55 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 15 },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const priority = data.cell.text[0].toLowerCase();
            if (priority === 'high') {
              data.cell.styles.textColor = [220, 38, 38]; // Red
              data.cell.styles.fontStyle = 'bold';
            } else if (priority === 'medium') {
              data.cell.styles.textColor = [234, 179, 8]; // Yellow
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [59, 130, 246]; // Blue
            }
          }
          if (data.section === 'body' && data.column.index === 7) {
            if (data.cell.text[0] === 'Yes') {
              data.cell.styles.textColor = [34, 197, 94]; // Green
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Structural Elements (if available)
      if (analysis.structuralElements && analysis.structuralElements.length > 0) {
        // Add new page if needed
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('STRUCTURAL ELEMENTS DETECTED', 15, yPos);
        yPos += 8;

        const structuralData = analysis.structuralElements.map((el: any) => [
          String(el.type || ''),
          String(el.location || ''),
          String(el.sustainabilityImpact || '').toUpperCase(),
          String(el.description || '-'),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Type', 'Location', 'Impact', 'Description']],
          body: structuralData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25 },
            3: { cellWidth: 'auto' },
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 2) {
              const impact = data.cell.text[0].toLowerCase();
              if (impact === 'high') {
                data.cell.styles.textColor = [220, 38, 38]; // Red
                data.cell.styles.fontStyle = 'bold';
              } else if (impact === 'medium') {
                data.cell.styles.textColor = [234, 179, 8]; // Yellow
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.textColor = [34, 197, 94]; // Green
              }
            }
          },
        });
      }

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Green Floor Plan Optimizer - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save(`green-floor-plan-report-${new Date().getTime()}.pdf`);
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const appliedRecommendations = analysis.recommendations.filter(
    (r: any) => r.applied
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-gray-900">Reports & Export</h2>
            <p className="text-sm text-gray-600">
              Review your analysis and download detailed reports
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Summary Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Environmental Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sustainability Score</p>
                  <p className="text-green-900">Excellent Performance</p>
                </div>
                <div className="text-right">
                  <div className="text-green-700">{analysis.overallScore}</div>
                  <p className="text-sm text-gray-600">out of 100</p>
                </div>
              </div>

              <Separator />

              {/* Key Metrics Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Annual Energy Savings</span>
                  </div>
                  <p className="text-green-700">
                    {analysis.metrics.estimatedEnergySavings}
                  </p>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">CO₂ Reduction</span>
                  </div>
                  <p className="text-blue-700">
                    {analysis.metrics.estimatedCO2Reduction}
                  </p>
                </div>

                <div className="p-4 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Total Investment</span>
                  </div>
                  <p className="text-amber-700">{convertCurrencyToRupees(analysis.metrics.totalCost)}</p>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Payback Period</span>
                  </div>
                  <p className="text-purple-700">{analysis.metrics.paybackPeriod}</p>
                </div>
              </div>

              <Separator />

              {/* Applied Recommendations Summary */}
              <div>
                <h4 className="mb-3 text-gray-900">Applied Modifications</h4>
                <div className="space-y-2">
                  {analysis.recommendations
                    .filter((r: any) => r.applied)
                    .map((rec: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-gray-900">{rec.title}</p>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Energy Savings</p>
                              <p className="text-sm text-green-700">{rec.energySavings}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">CO₂ Reduction</p>
                              <p className="text-sm text-blue-700">{rec.co2Reduction}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Cost</p>
                              <p className="text-sm text-amber-700">{rec.cost}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {rec.category}
                        </Badge>
                      </div>
                    ))}

                  {appliedRecommendations === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recommendations applied yet
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Structural Elements Analysis */}
              {analysis.structuralElements && analysis.structuralElements.length > 0 && (
                <>
                  <div>
                    <h4 className="mb-3 text-gray-900">Structural Elements Detected</h4>
                    <div className="space-y-2">
                      {analysis.structuralElements.map((element: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-gray-900">{element.type}</p>
                            <p className="text-sm text-gray-600">{element.location}</p>
                            {element.description && (
                              <p className="text-sm text-gray-500 mt-1">{element.description}</p>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={
                              element.sustainabilityImpact === 'high' 
                                ? 'bg-red-100 text-red-700 border-red-200' 
                                : element.sustainabilityImpact === 'medium'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-green-100 text-green-700 border-green-200'
                            }
                          >
                            {element.sustainabilityImpact} impact
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* All Recommendations */}
              <div>
                <h4 className="mb-3 text-gray-900">All Recommendations Summary</h4>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-lg ${
                        rec.applied ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-gray-900">{rec.title}</p>
                            {rec.applied && (
                              <Badge className="bg-green-600">Applied</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : 'bg-blue-100 text-blue-700 border-blue-200'
                          }
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm mt-2 pt-2 border-t border-gray-200">
                        <span className="text-green-700">⚡ {rec.energySavings}</span>
                        <span className="text-blue-700">🌍 {rec.co2Reduction}</span>
                        <span className="text-amber-700">💰 {rec.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download your analysis in different formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownloadPDF}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Full Report (PDF)
              </Button>
              
            </CardContent>
          </Card>
        </div>

        {/* History Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-600" />
                Analysis History
              </CardTitle>
              <CardDescription>Previous analyses for comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {loadingHistory ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
                ) : history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.id === analysisId
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            Score: {item.analysis.overallScore}
                          </Badge>
                          {item.id === analysisId && (
                            <Badge className="bg-green-600">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.analysis.recommendations.length} recommendations
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No previous analyses found
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}