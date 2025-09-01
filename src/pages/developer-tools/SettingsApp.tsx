import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings,
  Key,
  Database,
  Globe,
  TestTube,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';

interface SettingsAppProps {
  onBack: () => void;
}

interface APIConnection {
  id: string;
  service_name: string;
  status: 'connected' | 'disconnected' | 'error';
  last_tested?: string;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ onBack }) => {
  const [apiConnections, setApiConnections] = useState<APIConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  
  // API Key inputs
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [pineconeKey, setPineconeKey] = useState('');
  const [pineconeEnv, setPineconeEnv] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    loadAPIConnections();
    loadSavedCredentials();
  }, []);

  const loadAPIConnections = async () => {
    setIsLoading(true);
    try {
      const { data: existingConnections } = await db.getAPIConnections('demo-user');
      
      if (!existingConnections || existingConnections.length === 0) {
        const defaultConnections = [
          { service_name: 'openai', status: 'disconnected', user_id: 'demo-user', api_key_encrypted: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { service_name: 'perplexity', status: 'disconnected', user_id: 'demo-user', api_key_encrypted: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { service_name: 'pinecone', status: 'disconnected', user_id: 'demo-user', api_key_encrypted: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { service_name: 'supabase', status: 'connected', user_id: 'demo-user', api_key_encrypted: import.meta.env.VITE_SUPABASE_ANON_KEY || '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ];
        
        for (const conn of defaultConnections) {
          const { error } = await supabase.from('api_connections').insert(conn);
          if (error) {
            console.error('Error creating default connection:', error);
          }
        }
        
        const { data } = await db.getAPIConnections('demo-user');
        if (data) {
          setApiConnections(data);
        }
      } else {
        setApiConnections(existingConnections);
      }
    } catch (error) {
      console.error('Error loading API connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedCredentials = async () => {
    try {
      const { data: connections } = await db.getAPIConnections('demo-user');
      if (connections) {
        connections.forEach(conn => {
          if (conn.api_key_encrypted) {
            switch (conn.service_name) {
              case 'openai':
                setOpenaiKey(conn.api_key_encrypted);
                break;
              case 'perplexity':
                setPerplexityKey(conn.api_key_encrypted);
                break;
              case 'pinecone':
                setPineconeKey(conn.api_key_encrypted);
                // Load additional Pinecone params if stored in metadata
                if (conn.metadata?.environment) {
                  setPineconeEnv(conn.metadata.environment);
                }
                break;
              case 'supabase':
                setSupabaseKey(conn.api_key_encrypted);
                if (conn.metadata?.supabaseUrl) {
                  setSupabaseUrl(conn.metadata.supabaseUrl);
                }
                break;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const testConnection = async (service: string, apiKey: string, additionalParams?: any) => {
    setIsTesting(service);
    try {
      if (!apiKey.trim()) {
        alert('Please enter an API key first');
        setIsTesting(null);
        return { success: false, message: 'API key is required' };
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-api-connection`;
      
      if (!apiUrl || apiUrl.includes('undefined')) {
        alert('Supabase URL not configured. Please check your environment variables.');
        setIsTesting(null);
        return { success: false, message: 'Supabase URL not configured' };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          apiKey,
          additionalParams,
        }),
      });

      const result = await response.json();
      
      // Update or create connection status
      const existingConnection = apiConnections.find(conn => conn.service_name === service);
      const updateData = {
        status: result.success ? 'connected' : 'error',
        last_tested: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      if (existingConnection) {
        await db.updateAPIConnection(existingConnection.id, updateData);
      } else {
        const { error } = await supabase.from('api_connections').insert({
          service_name: service,
          ...updateData,
          user_id: 'demo-user',
          api_key_encrypted: '',
          created_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Error creating connection entry:', error);
        }
      }
      
      // Show result to user
      if (result.success) {
        alert(`✅ ${service.toUpperCase()} connection successful!\nResponse time: ${result.responseTime}ms`);
      } else {
        alert(`❌ ${service.toUpperCase()} connection failed:\n${result.message}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert(`❌ Connection test failed:\n${error.message}`);
      
      // Update status to error
      const existingConnection = apiConnections.find(conn => conn.service_name === service);
      if (existingConnection) {
        const { error } = await db.updateAPIConnection(existingConnection.id, {
          status: 'error',
          last_tested: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Error updating connection status:', error);
        }
      }
      
      return { success: false, message: 'Connection test failed' };
    } finally {
      setIsTesting(null);
      loadAPIConnections();
    }
  };

  const toggleApiKeyVisibility = (service: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const getConnectionStatus = (service: string) => {
    const connection = apiConnections.find(conn => conn.service_name === service);
    return connection?.status || 'disconnected';
  };

  const saveAPIKey = async (service: string, apiKey: string, additionalParams?: any) => {
    if (!apiKey.trim()) {
      alert('Please enter an API key');
      return;
    }

    try {
      const existingConnection = apiConnections.find(conn => conn.service_name === service);
      const saveData = {
        api_key_encrypted: apiKey,
        updated_at: new Date().toISOString(),
        metadata: additionalParams || {},
      };
      
      if (existingConnection) {
        const { data, error } = await supabase
          .from('api_connections')
          .update(saveData)
          .eq('id', existingConnection.id)
          .select()
          .single();
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Updated connection:', data);
      } else {
        const { data, error } = await supabase.from('api_connections').insert({
          service_name: service,
          ...saveData,
          status: 'disconnected',
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
        }).select().single();
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Created connection:', data);
      }
      
      alert(`✅ ${service.toUpperCase()} API key saved successfully!`);
      loadAPIConnections();
    } catch (error) {
      console.error('Error saving API key:', error);
      alert(`❌ Failed to save API key: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-500/10';
      case 'error':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const savePromises = [];
      
      if (openaiKey.trim()) {
        savePromises.push(saveAPIKey('openai', openaiKey));
      }
      if (perplexityKey.trim()) {
        savePromises.push(saveAPIKey('perplexity', perplexityKey));
      }
      if (pineconeKey.trim()) {
        savePromises.push(saveAPIKey('pinecone', pineconeKey, { environment: pineconeEnv }));
      }
      if (supabaseKey.trim()) {
        savePromises.push(saveAPIKey('supabase', supabaseKey, { supabaseUrl }));
      }
      
      await Promise.all(savePromises);
      
      // Log the save operation
      await db.createBuildLogEntry({
        action_type: 'api_settings_saved',
        action_description: `Saved API credentials for ${savePromises.length} services`,
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        metadata: { 
          services_updated: [
            openaiKey.trim() ? 'openai' : null,
            perplexityKey.trim() ? 'perplexity' : null,
            pineconeKey.trim() ? 'pinecone' : null,
            supabaseKey.trim() ? 'supabase' : null,
          ].filter(Boolean),
          total_services: savePromises.length
        },
      });
      
      if (savePromises.length > 0) {
        alert(`✅ Successfully saved ${savePromises.length} API credential(s)!`);
      } else {
        alert('ℹ️ No credentials to save. Please enter API keys first.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAPIKey = (serviceName: string) => {
    if (!confirm(`Are you sure you want to clear the ${serviceName.toUpperCase()} API key?`)) {
      return;
    }
    
    try {
      // Clear from state
      switch (serviceName) {
        case 'openai':
          setOpenaiKey('');
          break;
        case 'perplexity':
          setPerplexityKey('');
          break;
        case 'pinecone':
          setPineconeKey('');
          setPineconeEnv('');
          break;
        case 'supabase':
          setSupabaseKey('');
          setSupabaseUrl('');
          break;
      }
      
      // Clear from database
      const existingConnection = apiConnections.find(conn => conn.service_name === serviceName);
      if (existingConnection) {
        supabase.from('api_connections').update({
          api_key_encrypted: '',
          status: 'disconnected',
          last_tested: null,
          updated_at: new Date().toISOString(),
          metadata: {},
        }).eq('id', existingConnection.id);
      }
      
      alert(`✅ ${serviceName.toUpperCase()} credentials cleared successfully!`);
      loadAPIConnections();
    } catch (error) {
      console.error('Error clearing credentials:', error);
      alert(`❌ Failed to clear credentials: ${error.message}`);
    }
  };

  const testAllConnections = async () => {
    setIsLoading(true);
    let successCount = 0;
    let totalTests = 0;
    
    const connections = [
      { service: 'openai', key: openaiKey },
      { service: 'perplexity', key: perplexityKey },
      { service: 'pinecone', key: pineconeKey, params: { environment: pineconeEnv } },
      { service: 'supabase', key: supabaseKey, params: { supabaseUrl } },
    ].filter(conn => conn.key.trim());

    for (const conn of connections) {
      totalTests++;
      try {
        const result = await testConnection(conn.service, conn.key, conn.params);
        if (result?.success !== false) {
          successCount++;
        }
      } catch (error) {
        console.error(`Test failed for ${conn.service}:`, error);
      }
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsLoading(false);
    
    if (totalTests === 0) {
      alert('ℹ️ No API keys to test. Please enter credentials first.');
    } else {
      alert(`🧪 Connection Testing Complete!\n\n✅ Successful: ${successCount}/${totalTests}\n❌ Failed: ${totalTests - successCount}/${totalTests}`);
    }
  };

  const getLastTestedTime = (serviceName: string) => {
    const connection = apiConnections.find(conn => conn.service_name === serviceName);
    if (connection?.last_tested) {
      return new Date(connection.last_tested).toLocaleString();
    }
    return 'Never tested';
  };

  const resetAllSettings = () => {
    if (confirm('Are you sure you want to clear all API settings? This action cannot be undone.')) {
      try {
        // Clear all state
        setOpenaiKey('');
        setPerplexityKey('');
        setPineconeKey('');
        setPineconeEnv('');
        setSupabaseUrl('');
        setSupabaseKey('');
        
        // Clear all from database
        apiConnections.forEach(async (conn) => {
          await db.updateAPIConnection(conn.id, {
            api_key_encrypted: '',
            status: 'disconnected',
            last_tested: null,
            updated_at: new Date().toISOString(),
            metadata: {},
          });
        });
        
        alert('✅ All API settings have been cleared!');
        loadAPIConnections();
      } catch (error) {
        console.error('Error resetting settings:', error);
        alert(`❌ Failed to reset settings: ${error.message}`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App Management
        </Button>
        <h1 className="text-2xl font-bold text-white">App Settings</h1>
      </div>

      {/* API Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenAI Configuration */}
        <Card title="OpenAI Configuration" gradient>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">OpenAI API</span>
              </div>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${getStatusColor(getConnectionStatus('openai'))}`}>
                {getStatusIcon(getConnectionStatus('openai'))}
                <span className="capitalize">{getConnectionStatus('openai')}</span>
              </div>
            </div>
            
            <div className="relative">
              <Input
                label="API Key"
                type={showApiKeys.openai ? 'text' : 'password'}
                value={openaiKey}
                onChange={setOpenaiKey}
                placeholder="sk-..."
              />
              <button
                onClick={() => toggleApiKeyVisibility('openai')}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showApiKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={() => testConnection('openai', openaiKey)}
              disabled={!openaiKey || isTesting === 'openai'}
              className="w-full"
              size="sm"
            >
              {isTesting === 'openai' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-3 h-3 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button
              onClick={() => saveAPIKey('openai', openaiKey)}
              disabled={!openaiKey}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Save className="w-3 h-3 mr-2" />
              Save API Key
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => clearAPIKey('openai')}
                disabled={!openaiKey}
                variant="ghost"
                className="flex-1"
                size="sm"
              >
                Clear
              </Button>
              <div className="text-xs text-gray-500 flex-1 text-center py-2">
                Last tested: {getLastTestedTime('openai')}
              </div>
            </div>
          </div>
        </Card>

        {/* Perplexity Configuration */}
        <Card title="Perplexity Configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">Perplexity API</span>
              </div>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${getStatusColor(getConnectionStatus('perplexity'))}`}>
                {getStatusIcon(getConnectionStatus('perplexity'))}
                <span className="capitalize">{getConnectionStatus('perplexity')}</span>
              </div>
            </div>
            
            <div className="relative">
              <Input
                label="API Key"
                type={showApiKeys.perplexity ? 'text' : 'password'}
                value={perplexityKey}
                onChange={setPerplexityKey}
                placeholder="pplx-..."
              />
              <button
                onClick={() => toggleApiKeyVisibility('perplexity')}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showApiKeys.perplexity ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={() => testConnection('perplexity', perplexityKey)}
              disabled={!perplexityKey || isTesting === 'perplexity'}
              className="w-full"
              size="sm"
            >
              {isTesting === 'perplexity' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-3 h-3 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button
              onClick={() => saveAPIKey('perplexity', perplexityKey)}
              disabled={!perplexityKey}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Save className="w-3 h-3 mr-2" />
              Save API Key
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => clearAPIKey('perplexity')}
                disabled={!perplexityKey}
                variant="ghost"
                className="flex-1"
                size="sm"
              >
                Clear
              </Button>
              <div className="text-xs text-gray-500 flex-1 text-center py-2">
                Last tested: {getLastTestedTime('perplexity')}
              </div>
            </div>
          </div>
        </Card>

        {/* Pinecone Configuration */}
        <Card title="Pinecone Configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium">Pinecone Vector DB</span>
              </div>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${getStatusColor(getConnectionStatus('pinecone'))}`}>
                {getStatusIcon(getConnectionStatus('pinecone'))}
                <span className="capitalize">{getConnectionStatus('pinecone')}</span>
              </div>
            </div>
            
            <div className="relative">
              <Input
                label="API Key"
                type={showApiKeys.pinecone ? 'text' : 'password'}
                value={pineconeKey}
                onChange={setPineconeKey}
                placeholder="pc-..."
              />
              <button
                onClick={() => toggleApiKeyVisibility('pinecone')}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showApiKeys.pinecone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Environment"
              value={pineconeEnv}
              onChange={setPineconeEnv}
              placeholder="us-east-1-aws"
            />

            <Button
              onClick={() => testConnection('pinecone', pineconeKey, { environment: pineconeEnv })}
              disabled={!pineconeKey || !pineconeEnv || isTesting === 'pinecone'}
              className="w-full"
              size="sm"
            >
              {isTesting === 'pinecone' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-3 h-3 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button
              onClick={() => saveAPIKey('pinecone', pineconeKey, { environment: pineconeEnv })}
              disabled={!pineconeKey || !pineconeEnv}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Save className="w-3 h-3 mr-2" />
              Save API Key
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => clearAPIKey('pinecone')}
                disabled={!pineconeKey}
                variant="ghost"
                className="flex-1"
                size="sm"
              >
                Clear
              </Button>
              <div className="text-xs text-gray-500 flex-1 text-center py-2">
                Last tested: {getLastTestedTime('pinecone')}
              </div>
            </div>
          </div>
        </Card>

        {/* Supabase Configuration */}
        <Card title="Supabase Configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">Supabase Database</span>
              </div>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${getStatusColor(getConnectionStatus('supabase'))}`}>
                {getStatusIcon(getConnectionStatus('supabase'))}
                <span className="capitalize">{getConnectionStatus('supabase')}</span>
              </div>
            </div>
            
            <Input
              label="Project URL"
              value={supabaseUrl}
              onChange={setSupabaseUrl}
              placeholder="https://your-project.supabase.co"
            />

            <div className="relative">
              <Input
                label="Anon Key"
                type={showApiKeys.supabase ? 'text' : 'password'}
                value={supabaseKey}
                onChange={setSupabaseKey}
                placeholder="eyJ..."
              />
              <button
                onClick={() => toggleApiKeyVisibility('supabase')}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showApiKeys.supabase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={() => testConnection('supabase', supabaseKey, { supabaseUrl })}
              disabled={!supabaseKey || !supabaseUrl || isTesting === 'supabase'}
              className="w-full"
              size="sm"
            >
              {isTesting === 'supabase' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-3 h-3 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button
              onClick={() => saveAPIKey('supabase', supabaseKey, { supabaseUrl })}
              disabled={!supabaseKey || !supabaseUrl}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Save className="w-3 h-3 mr-2" />
              Save API Key
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => clearAPIKey('supabase')}
                disabled={!supabaseKey}
                variant="ghost"
                className="flex-1"
                size="sm"
              >
                Clear
              </Button>
              <div className="text-xs text-gray-500 flex-1 text-center py-2">
                Last tested: {getLastTestedTime('supabase')}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Connection Status Overview */}
      <Card title="Connection Status Overview" gradient>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { service: 'OpenAI', key: 'openai', icon: Key, color: 'text-cyan-400' },
            { service: 'Perplexity', key: 'perplexity', icon: Globe, color: 'text-purple-400' },
            { service: 'Pinecone', key: 'pinecone', icon: Database, color: 'text-green-400' },
            { service: 'Supabase', key: 'supabase', icon: Database, color: 'text-blue-400' },
          ].map((service) => {
            const Icon = service.icon;
            const status = getConnectionStatus(service.key);
            const connection = apiConnections.find(conn => conn.service_name === service.key);
            const hasCredentials = connection?.api_key_encrypted?.trim();
            
            return (
              <div
                key={service.key}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 ${service.color}`} />
                  <span className="text-white font-medium">{service.service}</span>
                </div>
                <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  <span className="capitalize">{status}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {hasCredentials ? '🔑 Credentials saved' : '⚠️ No credentials'}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Global Actions */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            onClick={testAllConnections}
            disabled={isLoading || !apiConnections.some(conn => conn.api_key_encrypted?.trim())}
            variant="primary"
            className="px-6"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Testing All...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Test All Connections
              </>
            )}
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={saveSettings}
              disabled={isLoading}
              variant="secondary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
            
            <Button
              onClick={resetAllSettings}
              variant="danger"
              size="sm"
            >
              Reset All
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};