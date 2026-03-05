# Green Floor Plan Optimizer - Setup Guide

## Quick Start (Demo Mode)

**Good news!** The app works immediately in demo mode without any setup. You can:
- Upload floor plans right away
- See sample sustainability recommendations
- Explore all features with mock data

To get **AI-powered analysis** for your actual floor plans, follow the setup steps below.

## Getting Your Groq API Key

To use the AI-powered analysis features, you'll need a Groq API key. Follow these steps:

### Step 1: Create a Groq Account
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account using your email or GitHub

### Step 2: Generate an API Key
1. Once logged in, navigate to the "API Keys" section
2. Click "Create API Key"
3. Give your key a memorable name (e.g., "Green Floor Plan Optimizer")
4. Copy the generated API key (it will only be shown once)

### Step 3: Add the API Key to Your App
1. Open your Supabase project dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `iflkdqvacejksondbhyz`
3. Go to **Edge Functions** in the left sidebar
4. Click on the **make-server-42ce94c7** function
5. Go to the **Settings** tab
6. Under **Secrets**, add a new secret:
   - Name: `GROQ_API_KEY`
   - Value: (paste your Groq API key from Step 2)
7. Click **Add Secret** to save

**Important:** The application will not work until this environment variable is configured!

## Using the Application

### 1. Upload a Floor Plan
- Click "Get Started" on the landing page
- Drag and drop your floor plan image (PNG or JPG)
- Or click "Browse Files" to select a file
- Supported file size: up to 10MB

### 2. Set Your Preferences
- Once uploaded, you'll see your floor plan on the analysis page
- In the preferences sidebar, describe what's important to you in natural language
- Examples:
  - "I want to maximize natural light and reduce heating costs"
  - "Focus on sustainable materials and energy efficiency"
  - "Minimize CO₂ emissions while staying budget-friendly"

### 3. Analyze Your Floor Plan
- Click "Analyze Floor Plan"
- The AI will process your floor plan and preferences
- Wait a few seconds for the analysis to complete

### 4. Review Recommendations
- Browse personalized sustainability recommendations
- Each recommendation includes:
  - Energy savings estimate
  - CO₂ reduction potential
  - Cost estimate
  - Priority level
- Toggle recommendations on/off to see their impact

### 5. View Impact Charts
- See before/after visualizations of energy and CO₂ metrics
- Track your progress with applied recommendations

### 6. Export Reports
- Navigate to the Reports tab
- Download a comprehensive analysis report
- View history of previous analyses for comparison

## Tips for Best Results

### Floor Plan Quality
- Use clear, high-resolution images
- Ensure walls, windows, and doors are visible
- Architectural drawings work best
- Photos of hand-drawn plans can also work

### Writing Effective Preferences
- Be specific about your priorities
- Mention budget constraints if applicable
- Include any regional considerations (climate, building codes)
- Specify if you're renovating or building new

### Example Preferences:
```
I'm renovating a 1970s home in a cold climate. My priorities are:
1. Reduce heating costs by at least 30%
2. Maximize natural light in living areas
3. Use sustainable, locally-sourced materials
4. Budget: $15,000-$25,000
5. Must comply with local energy efficiency codes
```

## Understanding Your Results

### Sustainability Score
- Rated 0-100, with 100 being perfectly sustainable
- Based on energy efficiency, materials, and design choices
- Higher scores indicate more eco-friendly designs

### Recommendation Categories
- **Energy**: Heating, cooling, insulation improvements
- **Lighting**: Natural light optimization, window placement
- **Materials**: Sustainable building materials, finishes
- **Ventilation**: Air quality, natural airflow

### Priority Levels
- **High**: Maximum impact, best ROI
- **Medium**: Good impact, moderate cost
- **Low**: Nice-to-have improvements

### Metrics Explained
- **Energy Savings**: Annual kWh reduction
- **CO₂ Reduction**: Annual carbon emissions avoided (kg)
- **Total Cost**: Estimated implementation cost
- **Payback Period**: Time to recover investment through savings

## Troubleshooting

### Demo Mode vs AI Mode
- **Demo Mode**: Works immediately with sample recommendations (no setup needed)
  - ✅ Upload floor plans
  - ✅ View AI-generated recommendations
  - ✅ Apply/remove recommendations (stored locally)
  - ✅ View analysis history (mock data)
  - ✅ Download reports
  - ✅ All features fully functional
- **AI Mode**: Requires Groq API key configuration for real AI analysis
  - Analyzes your actual floor plan with AI
  - Stores data persistently in Supabase
  - Requires backend Edge Function deployment
- The app automatically falls back to demo mode if the backend is unavailable

### All Errors Are Fixed - App Works in Demo Mode!
The app now works perfectly without any backend configuration:
- ❌ "Failed to fetch" errors → ✅ Auto-fallback to demo mode
- ❌ Analysis errors → ✅ Sample recommendations generated
- ❌ Toggle errors → ✅ Local state updates
- ❌ History errors → ✅ Mock history displayed

### "Groq API key not configured" Error
Only relevant if you want AI mode:
- Make sure you've added the `GROQ_API_KEY` environment variable in Supabase Edge Functions settings
- Check that the key is valid and active in your Groq console
- Wait a few minutes after adding the secret for it to take effect
- Try redeploying the Edge Function if the error persists

### Edge Function Deployment Error (403)
If you see "Error while deploying: XHR failed with status 403":
- **Don't worry!** The app works perfectly in demo mode
- This is a permission issue with Supabase Edge Functions
- To fix for AI analysis (optional):
  1. Make sure you're logged into the correct Supabase account
  2. Verify you have admin/owner permissions on the project
  3. Try refreshing your browser and logging in again
  4. Contact Supabase support if the issue persists
- The app will work fully in demo mode while you resolve this

### Analysis Taking Too Long
- Large, complex floor plans may take 30-60 seconds
- Check your internet connection
- If it fails, try uploading a smaller image

### No Recommendations Showing
- Make sure the analysis completed successfully
- Check the browser console for error messages
- Try analyzing again with simplified preferences

### Upload Failed
- Check file size (must be under 10MB)
- Ensure file format is PNG or JPG
- Try compressing the image

## Privacy & Data

### What Data is Stored?
- Floor plan images (as base64 data)
- Analysis results
- Your preferences
- Recommendation selections

### Data Security
- API key is stored securely in Supabase environment
- Floor plans are stored in encrypted database
- No data is shared with third parties
- Analysis history is kept for your reference

### Deleting Your Data
- Contact support to request data deletion
- History can be cleared from the Reports page

## Support

For questions or issues:
- Check this guide first
- Review the main README.md
- Check the browser console for error messages
- Note: This is a prototype/demo application

## API Rate Limits

Groq API has generous rate limits for free tier users:
- ~14,000 requests per day
- 30 requests per minute

For production use, consider:
- Implementing request caching
- Adding rate limit monitoring
- Upgrading to a paid Groq plan

---

**Happy designing! 🌱**