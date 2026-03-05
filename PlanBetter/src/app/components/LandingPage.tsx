import React from 'react';
import { Upload, Leaf, TrendingDown, IndianRupee, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'motion/react';
import { Alert, AlertDescription } from './ui/alert';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Demo Mode Banner */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="text-green-700">AI-Powered Sustainability</span>
          </motion.div>
          
          <motion.h1 
            className="mb-6 text-green-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Design Eco-Friendly Homes with AI
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transform your floor plans into sustainable, energy-efficient spaces. 
            Get instant AI-powered recommendations to reduce your carbon footprint and save on energy costs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button 
              onClick={onGetStarted} 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Upload Area Preview */}
        <motion.div 
          className="max-w-3xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          
        </motion.div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          {[
            {
              icon: Leaf,
              title: "Energy Savings",
              description: "Optimize your design for maximum energy efficiency. Reduce consumption by up to 40% with smart recommendations.",
              color: "green",
              delay: 0.7
            },
            {
              icon: TrendingDown,
              title: "CO₂ Reduction",
              description: "Lower your carbon footprint with sustainable materials and design choices. Track your environmental impact.",
              color: "blue",
              delay: 0.8
            },
            {
              icon: IndianRupee,
              title: "Cost Optimization",
              description: "Get cost-effective green solutions with clear ROI analysis. Understand payback periods for each improvement.",
              color: "emerald",
              delay: 0.9
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: benefit.delay, duration: 0.5 }}
            >
              <Card className={`border-${benefit.color}-200 hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${benefit.color}-100 rounded-lg mb-4`}>
                    <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                  </div>
                  <h3 className="mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">How PlanBetter Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your floor plan and provides personalized recommendations 
              based on your preferences and sustainability goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">Upload Floor Plan</h4>
                  <p className="text-gray-600">
                    Upload your architectural drawings in any standard format
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">AI Analysis</h4>
                  <p className="text-gray-600">
                    Our AI identifies structural elements and analyzes sustainability potential
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">Get Recommendations</h4>
                  <p className="text-gray-600">
                    Receive personalized suggestions with energy savings and cost estimates
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  4
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">Export & Implement</h4>
                  <p className="text-gray-600">
                    Download detailed reports and track your environmental impact
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1521708266372-b3547456cc2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGJ1aWxkaW5nJTIwZGVzaWdufGVufDF8fHx8MTc2NjIzMzkxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Green Building Design"
                className="rounded-xl shadow-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Journey to Sustainability */}
        <div className="mt-20 max-w-6xl mx-auto">
          
        </div>
      </div>
    </div>
  );
}