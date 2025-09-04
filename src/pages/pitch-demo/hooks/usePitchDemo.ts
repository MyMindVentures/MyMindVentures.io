import { useState, useEffect } from 'react';
import { supabaseService as db, supabase } from '../../../lib/supabase';
import { PitchContent, RecoveryDoc } from '../types';

export const usePitchDemo = () => {
  const [pitchContent, setPitchContent] = useState<PitchContent[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<RecoveryDoc | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [visitorId] = useState(
    () => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    loadPitchContent();
    loadLatestAnalysis();
    trackPageView();

    // Auto-rotate features every 6 seconds
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const loadPitchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pitch_content')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('last_updated', { ascending: false });

      if (data) {
        setPitchContent(data);
      }
    } catch (error) {
      console.error('Error loading pitch content:', error);
    }
  };

  const loadLatestAnalysis = async () => {
    try {
      const { data } = await db.getRecoveryDocumentation('demo-user');
      if (data && data.length > 0) {
        setLatestAnalysis(data[0]);
      }
    } catch (error) {
      console.error('Error loading latest analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackPageView = async () => {
    try {
      await supabase.from('pitch_analytics').insert({
        visitor_id: visitorId,
        page_views: 1,
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const generateAIPitchContent = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pitch-content`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          section_type: 'complete',
          force_regenerate: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadPitchContent();
        alert(
          '🚀 AI has generated amazing new pitch content! The page is now updated with the latest revolutionary features.'
        );
      } else {
        alert(`❌ AI generation failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error generating pitch content:', error);
      alert('❌ Failed to generate pitch content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareDemo = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(
        '🔗 Demo URL copied to clipboard! Share this revolutionary platform with others.'
      );
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const getPitchSection = (sectionType: string) => {
    return pitchContent.find(p => p.section_type === sectionType);
  };

  return {
    pitchContent,
    latestAnalysis,
    isLoading,
    isGenerating,
    activeFeature,
    setActiveFeature,
    generateAIPitchContent,
    shareDemo,
    getPitchSection,
  };
};
