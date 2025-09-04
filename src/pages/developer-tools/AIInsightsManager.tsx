import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

interface AIInsight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  content: string;
  prompt: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'implemented' | 'archived' | 'deprecated';
  is_implemented: boolean;
  tags: string[];
  related_files: string[];
  related_components: string[];
  related_features: string[];
  ai_model: string;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

const AIInsightsManager: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInsights, setFilteredInsights] = useState<AIInsight[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    prompt: '',
    category: 'pwa-architecture',
    priority: 'medium' as const,
    tags: '',
    related_files: '',
    related_components: '',
    related_features: ''
  });

  const categories = [
    { value: 'pwa-architecture', label: 'PWA Architecture', color: 'bg-blue-100 text-blue-800' },
    { value: 'performance-optimization', label: 'Performance', color: 'bg-green-100 text-green-800' },
    { value: 'user-experience', label: 'User Experience', color: 'bg-purple-100 text-purple-800' },
    { value: 'code-quality', label: 'Code Quality', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'testing-strategy', label: 'Testing', color: 'bg-red-100 text-red-800' },
    { value: 'deployment', label: 'Deployment', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'security', label: 'Security', color: 'bg-orange-100 text-orange-800' },
    { value: 'accessibility', label: 'Accessibility', color: 'bg-pink-100 text-pink-800' },
    { value: 'feature-planning', label: 'Feature Planning', color: 'bg-teal-100 text-teal-800' },
    { value: 'bug-resolution', label: 'Bug Resolution', color: 'bg-gray-100 text-gray-800' },
    { value: 'code-refactoring', label: 'Code Refactoring', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'documentation', label: 'Documentation', color: 'bg-lime-100 text-lime-800' },
    { value: 'best-practices', label: 'Best Practices', color: 'bg-amber-100 text-amber-800' },
    { value: 'technology-selection', label: 'Technology', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'scalability', label: 'Scalability', color: 'bg-violet-100 text-violet-800' },
    { value: 'monitoring', label: 'Monitoring', color: 'bg-rose-100 text-rose-800' },
    { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-800' }
  ];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    implemented: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
    deprecated: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    filterInsights();
  }, [insights, selectedCategory, searchQuery]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // Pre-load the user's Perplexity.ai insight exactly as provided
      const preloadedInsight: AIInsight = {
        id: 'perplexity-insight-001',
        user_id: 'user',
        title: 'Professioneel PWA Dashboard met Volledig Geautomatiseerde Workflow',
        description: 'Integreer in mijn centrale PWA een professioneel dashboard met selectiemenu voor alle actieve sub-apps/modules, twee centrale knoppen (Launch App & Update App), en een volledig geautomatiseerde workflow via AI agents.',
        content: `Jij bent een senior AI developer en PWA workflow-expert.

Opdracht:
Integreer in mijn centrale PWA een professioneel dashboard met:

1. Selectiemenu/dropdown waarin alle actieve sub-apps/modules zichtbaar zijn.
2. Twee centrale knoppen:
   a. **Launch App** – werkt enkel op de door mij geselecteerde app/module.
   b. **Update App** – idem, ik kies welke app ik hiermee wil updaten.
3. Bij klikken op een knop:
   - Start de volledige workflow (build, test, security-check, deploy, cache refresh, documentatie genereren, privacy/cookie update, changelog maken).
   - Zet automatisch alle stappen door via OpenAI, Cursor.ai, Bolt.ai agents.
   - Feedback/log: iedere stap wordt gelogd in een statuspanel en korte samenvatting ("werkt/failed, wat nu?").
   - Genereer per actie een gebruikershandleiding (installatie/update), troubleshooting, en changelog-documentatie in Nederlands én Engels.
   - Zorg dat alles GDPR, security en SEO compliant is.

4. Tools en technologie:
   - Bouw het dashboard met Next.js 15, SvelteKit 2, Nuxt 4 (keuze afhankelijk van bestaande codebase).
   - Documentatie en changelogs via AI Agents/OpenAI Function Calling.
   - Hosting via Vercel, Netlify of Cloudflare.
   - Security audits via Snyk, GitHub Security.
   - Monitoring Sentry, Vercel Analytics.
   - Contentbeheer via Strapi/Sanity/Contentful.
   - UX: duidelijke onboarding, wizard, feedbackprompts bij update/lancering, accessibility best practices.

5. Unieke features:
   - Optie voor automatische user update: bij update prompt, cache refresh en "Nieuw in deze versie"-melding.
   - Realtime gebruikersnotificaties en status updates via push of dashboard indicator.
   - Onboardingsflow en wizard die gebruikers meteen instrueert bij nieuwe installatie of update.

Output:
- Werkend dashboard in centrale PWA, volledig geautomatiseerd, schaalbaar, visueel en begrijpelijk voor niet-developers.
- Slechts twee knoppen en selectie per app/module voor jou als bedenker. De workflow, logging, documentatie en alle technische taken gebeuren als één volledig geautomatiseerde flow.
- Alle gebruikersinstructies, updates en support-uitingen zijn direct beschikbaar voor jou en de eindgebruikers, in NL/EN.

Voer deze opdracht in zijn geheel uit zodat alles volgende week live kan.`,
        prompt: 'Jij bent een senior AI developer en PWA workflow-expert. Opdracht: Integreer in mijn centrale PWA een professioneel dashboard met selectiemenu voor alle actieve sub-apps/modules, twee centrale knoppen (Launch App & Update App), en een volledig geautomatiseerde workflow via AI agents.',
        category: 'pwa-architecture',
        priority: 'critical',
        status: 'active',
        is_implemented: false,
        tags: ['pwa', 'dashboard', 'workflow', 'automation', 'ai-agents', 'deployment', 'monitoring', 'nextjs', 'sveltekit', 'nuxt', 'vercel', 'netlify', 'cloudflare', 'sentry', 'strapi', 'sanity', 'contentful', 'gdpr', 'security', 'seo'],
        related_files: ['src/App.tsx', 'src/pages/Dashboards.tsx', 'src/components/layout/Header.tsx', 'src/components/layout/Sidebar.tsx'],
        related_components: ['Dashboard', 'AppSelector', 'LaunchButton', 'UpdateButton', 'WorkflowStatus', 'StatusPanel'],
        related_features: ['app-selection', 'workflow-automation', 'ai-agents', 'deployment-pipeline', 'monitoring', 'documentation-generation', 'user-notifications'],
        ai_model: 'perplexity-ai',
        confidence_score: 0.95,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setInsights([preloadedInsight]);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInsights = () => {
    let filtered = insights;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(insight => insight.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(insight =>
        insight.title.toLowerCase().includes(query) ||
        insight.description.toLowerCase().includes(query) ||
        insight.content.toLowerCase().includes(query) ||
        insight.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredInsights(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For now, just add to local state since we don't have the database set up yet
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        user_id: 'temp-user',
        title: formData.title,
        description: formData.description,
        content: formData.content,
        prompt: formData.prompt,
        category: formData.category,
        priority: formData.priority,
        status: 'active',
        is_implemented: false,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        related_files: formData.related_files.split(',').map(file => file.trim()).filter(Boolean),
        related_components: formData.related_components.split(',').map(comp => comp.trim()).filter(Boolean),
        related_features: formData.related_features.split(',').map(feature => feature.trim()).filter(Boolean),
        ai_model: 'perplexity-ai',
        confidence_score: 0.85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setInsights(prev => [newInsight, ...prev]);

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        prompt: '',
        category: 'pwa-architecture',
        priority: 'medium',
        tags: '',
        related_files: '',
        related_components: '',
        related_features: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating insight:', error);
    }
  };

  const updateInsightStatus = async (id: string, status: string, isImplemented: boolean) => {
    try {
      setInsights(prev => prev.map(insight => 
        insight.id === id 
          ? { ...insight, status: status as any, is_implemented: isImplemented }
          : insight
      ));
    } catch (error) {
      console.error('Error updating insight:', error);
    }
  };

  const deleteInsight = async (id: string) => {
    if (!confirm('Are you sure you want to delete this insight?')) return;
    
    try {
      setInsights(prev => prev.filter(insight => insight.id !== id));
    } catch (error) {
      console.error('Error deleting insight:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading AI Insights...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights Manager</h1>
          <p className="text-gray-600 mt-2">
            Manage and organize all your Perplexity.ai insights for PWA development
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Insight'}
        </Button>
      </div>

      {/* Add New Insight Form */}
      {showAddForm && (
        <Card title="Add New AI Insight">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter insight title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the insight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Prompt *
                </label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="What did you ask Perplexity.ai?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Response Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste the full response from Perplexity.ai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="pwa, performance, optimization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Files (comma-separated)
                  </label>
                  <Input
                    value={formData.related_files}
                    onChange={(e) => setFormData({ ...formData, related_files: e.target.value })}
                    placeholder="src/components/Header.tsx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Components (comma-separated)
                  </label>
                  <Input
                    value={formData.related_components}
                    onChange={(e) => setFormData({ ...formData, related_components: e.target.value })}
                    placeholder="Header, Sidebar, Navigation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Features (comma-separated)
                  </label>
                  <Input
                    value={formData.related_features}
                    onChange={(e) => setFormData({ ...formData, related_features: e.target.value })}
                    placeholder="authentication, caching, offline"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Insight
                </Button>
              </div>
            </form>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} title={insight.title} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories.find(c => c.value === insight.category)?.color}`}>
                  {categories.find(c => c.value === insight.category)?.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[insight.priority]}`}>
                  {insight.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[insight.status]}`}>
                  {insight.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3">
                {insight.description || insight.content.substring(0, 150)}...
              </p>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">Prompt:</span>
                  <p className="text-xs text-gray-600 line-clamp-2">{insight.prompt}</p>
                </div>
                
                {insight.tags.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {insight.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {insight.related_files.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Files:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {insight.related_files.map((file, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateInsightStatus(
                      insight.id, 
                      insight.status === 'implemented' ? 'active' : 'implemented',
                      !insight.is_implemented
                    )}
                  >
                    {insight.is_implemented ? '✓' : '○'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteInsight(insight.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  <span>AI: {insight.ai_model}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchQuery || selectedCategory !== 'all' 
              ? 'No insights match your filters' 
              : 'No AI insights yet. Start by adding your first Perplexity.ai insight!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsManager;
