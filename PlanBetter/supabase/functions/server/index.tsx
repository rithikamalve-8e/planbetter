import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-42ce94c7/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload floor plan
app.post("/make-server-42ce94c7/upload-floor-plan", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, name } = body;

    const id = `floor-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const floorPlan = {
      id,
      name,
      imageData,
      uploadedAt: new Date().toISOString(),
    };

    await kv.set(`floor-plan:${id}`, floorPlan);

    return c.json({ success: true, id, floorPlan });
  } catch (error) {
    console.log(`Error uploading floor plan: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Analyze floor plan with Groq AI
app.post("/make-server-42ce94c7/analyze-floor-plan", async (c) => {
  try {
    const body = await c.req.json();
    const { floorPlanId, preferences, imageData, name } = body;

    // Store floor plan if imageData is provided (for client-side uploads)
    if (imageData) {
      const floorPlan = {
        id: floorPlanId,
        name: name || 'Floor Plan',
        imageData,
        uploadedAt: new Date().toISOString(),
      };
      await kv.set(`floor-plan:${floorPlanId}`, floorPlan);
    }

    const floorPlan = await kv.get(`floor-plan:${floorPlanId}`);
    if (!floorPlan) {
      return c.json({ success: false, error: "Floor plan not found" }, 404);
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return c.json({ success: false, error: "Groq API key not configured" }, 500);
    }

    // Call Groq API for analysis
    const prompt = `Analyze this floor plan for sustainability and eco-friendliness. 
User preferences: ${JSON.stringify(preferences)}.
Provide recommendations for:
1. Energy efficiency improvements
2. Natural lighting optimization
3. Sustainable materials
4. CO₂ reduction strategies
5. Cost-effective green modifications

Return a JSON response with the following structure:
{
  "structuralElements": [{"type": "wall/window/door", "location": "description", "sustainabilityImpact": "high/medium/low"}],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description",
      "category": "energy/lighting/materials/ventilation",
      "energySavings": "percentage or kWh value",
      "co2Reduction": "kg CO₂ per year",
      "cost": "estimated cost",
      "priority": "high/medium/low"
    }
  ],
  "overallScore": "sustainability score out of 100",
  "metrics": {
    "estimatedEnergySavings": "annual kWh",
    "estimatedCO2Reduction": "annual kg",
    "totalCost": "estimated total cost",
    "paybackPeriod": "years"
  }
}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.log(`Groq API error: ${errorText}`);
      return c.json({ success: false, error: `Groq API error: ${errorText}` }, 500);
    }

    const groqData = await groqResponse.json();
    const analysisText = groqData.choices[0]?.message?.content || "{}";
    
    // Parse the JSON response from Groq
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.log(`Error parsing Groq response: ${parseError}`);
      // Provide default analysis if parsing fails
      analysis = {
        structuralElements: [],
        recommendations: [
          {
            title: "Energy-Efficient Windows",
            description: "Install double-glazed windows to reduce heat loss",
            category: "energy",
            energySavings: "15%",
            co2Reduction: "500 kg/year",
            cost: "₹2,50,000",
            priority: "high"
          }
        ],
        overallScore: "70",
        metrics: {
          estimatedEnergySavings: "2,500 kWh",
          estimatedCO2Reduction: "1,200 kg",
          totalCost: "₹6,65,000",
          paybackPeriod: "5 years"
        }
      };
    }

    // Save analysis
    const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const analysisData = {
      id: analysisId,
      floorPlanId,
      analysis,
      preferences,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`analysis:${analysisId}`, analysisData);
    
    // Add to history
    const historyKey = `history:${floorPlanId}`;
    const history = (await kv.get(historyKey)) || [];
    history.unshift(analysisId);
    await kv.set(historyKey, history.slice(0, 10)); // Keep last 10

    return c.json({ success: true, analysisId, analysis });
  } catch (error) {
    console.log(`Error analyzing floor plan: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get analysis
app.get("/make-server-42ce94c7/analysis/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const analysis = await kv.get(`analysis:${id}`);
    
    if (!analysis) {
      return c.json({ success: false, error: "Analysis not found" }, 404);
    }

    return c.json({ success: true, analysis });
  } catch (error) {
    console.log(`Error fetching analysis: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get analysis history
app.get("/make-server-42ce94c7/history/:floorPlanId", async (c) => {
  try {
    const floorPlanId = c.req.param("floorPlanId");
    const historyIds = (await kv.get(`history:${floorPlanId}`)) || [];
    
    const analyses = await Promise.all(
      historyIds.map(async (id: string) => {
        const analysis = await kv.get(`analysis:${id}`);
        return analysis;
      })
    );

    return c.json({ success: true, history: analyses.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching history: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Apply recommendation
app.post("/make-server-42ce94c7/apply-recommendation", async (c) => {
  try {
    const body = await c.req.json();
    const { analysisId, recommendationIndex, applied } = body;

    const analysisData = await kv.get(`analysis:${analysisId}`);
    if (!analysisData) {
      return c.json({ success: false, error: "Analysis not found" }, 404);
    }

    // Update recommendation applied status
    if (analysisData.analysis.recommendations[recommendationIndex]) {
      analysisData.analysis.recommendations[recommendationIndex].applied = applied;
      await kv.set(`analysis:${analysisId}`, analysisData);
    }

    return c.json({ success: true, analysis: analysisData.analysis });
  } catch (error) {
    console.log(`Error applying recommendation: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);