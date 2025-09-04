import React, { useState, useEffect } from 'react';
import { securityManager } from '../../lib/security/SecurityManager';
import { SecurityMonitor, checkPasswordStrength } from '../../lib/security/SecurityUtils';

interface SecurityDashboardProps {
  variant?: 'compact' | 'detailed' | 'card';
  showEvents?: boolean;
  showConfig?: boolean;
  showPasswordChecker?: boolean;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  variant = 'card',
  showEvents = true,
  showConfig = true,
  showPasswordChecker = true
}) => {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      if (showEvents) {
        const events = SecurityMonitor.getEvents();
        setSecurityEvents(events);
      }
      
      if (showConfig) {
        const securityConfig = securityManager.getConfig();
        setConfig(securityConfig);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCheck = () => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const clearEvents = () => {
    SecurityMonitor.clearEvents();
    setSecurityEvents([]);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔒 Security Status</h3>
          <button
            onClick={loadSecurityData}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            🔄 Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded">
            <div className="text-2xl font-bold text-green-600">
              {securityEvents.filter(e => e.severity === 'low').length}
            </div>
            <div className="text-sm text-green-600">Low</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {securityEvents.filter(e => e.severity === 'medium').length}
            </div>
            <div className="text-sm text-yellow-600">Medium</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-2xl font-bold text-red-600">
              {securityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length}
            </div>
            <div className="text-sm text-red-600">High/Critical</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔒 Security Dashboard</h2>
          <div className="flex space-x-2">
            <button
              onClick={loadSecurityData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
            {showEvents && (
              <button
                onClick={clearEvents}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️ Clear Events
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Helmet Active:</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rate Limiting:</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Input Validation:</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">CORS Protection:</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          {showEvents && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {securityEvents.slice(0, 5).map((event, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm ${getSeverityColor(event.severity)}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{getSeverityIcon(event.severity)}</span>
                      <span className="font-medium">{event.event}</span>
                    </div>
                    <div className="text-xs mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {securityEvents.length === 0 && (
                  <p className="text-gray-500 text-sm">No security events</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Password Strength Checker */}
        {showPasswordChecker && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Strength Checker</h3>
            <div className="flex space-x-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to check"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePasswordCheck}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Check
              </button>
            </div>
            
            {passwordStrength && (
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Strength:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    passwordStrength.strength === 'weak' ? 'bg-red-100 text-red-800' :
                    passwordStrength.strength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    passwordStrength.strength === 'strong' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {passwordStrength.strength.toUpperCase()}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score <= 4 ? 'bg-yellow-500' :
                        passwordStrength.score <= 6 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1">Suggestions:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordStrength.feedback.map((feedback: string, index: number) => (
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Configuration */}
        {showConfig && config && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Helmet</h4>
                <div className="text-sm space-y-1">
                  <div>CSP: {config.helmet.contentSecurityPolicy ? '✓' : '✗'}</div>
                  <div>HSTS: {config.helmet.hsts ? '✓' : '✗'}</div>
                  <div>XSS Filter: {config.helmet.xssFilter ? '✓' : '✗'}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Validation</h4>
                <div className="text-sm space-y-1">
                  <div>Strict Mode: {config.validation.strictMode ? '✓' : '✗'}</div>
                  <div>Max String: {config.validation.maxStringLength}</div>
                  <div>Max Array: {config.validation.maxArrayLength}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Rate Limiting</h4>
                <div className="text-sm space-y-1">
                  <div>Enabled: {config.rateLimit.enabled ? '✓' : '✗'}</div>
                  <div>Window: {config.rateLimit.windowMs / 1000 / 60}min</div>
                  <div>Max: {config.rateLimit.maxRequests}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🔒 Security Dashboard - Detailed View</h2>
        <div className="flex space-x-2">
          <button
            onClick={loadSecurityData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
          {showEvents && (
            <button
              onClick={clearEvents}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Clear Events
            </button>
          )}
        </div>
      </div>

      {/* Security Events Table */}
      {showEvents && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Events</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {securityEvents.map((event, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
                {securityEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No security events
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password Checker and Configuration sections remain the same as card variant */}
      {showPasswordChecker && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Strength Checker</h3>
          <div className="flex space-x-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePasswordCheck}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Check
            </button>
          </div>
          
          {passwordStrength && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Strength:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  passwordStrength.strength === 'weak' ? 'bg-red-100 text-red-800' :
                  passwordStrength.strength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  passwordStrength.strength === 'strong' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {passwordStrength.strength.toUpperCase()}
                </span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 4 ? 'bg-yellow-500' :
                      passwordStrength.score <= 6 ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Suggestions:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {passwordStrength.feedback.map((feedback: string, index: number) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showConfig && config && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-900 mb-2">Helmet</h4>
              <div className="text-sm space-y-1">
                <div>CSP: {config.helmet.contentSecurityPolicy ? '✓' : '✗'}</div>
                <div>HSTS: {config.helmet.hsts ? '✓' : '✗'}</div>
                <div>XSS Filter: {config.helmet.xssFilter ? '✓' : '✗'}</div>
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-900 mb-2">Validation</h4>
              <div className="text-sm space-y-1">
                <div>Strict Mode: {config.validation.strictMode ? '✓' : '✗'}</div>
                <div>Max String: {config.validation.maxStringLength}</div>
                <div>Max Array: {config.validation.maxArrayLength}</div>
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-900 mb-2">Rate Limiting</h4>
              <div className="text-sm space-y-1">
                <div>Enabled: {config.rateLimit.enabled ? '✓' : '✗'}</div>
                <div>Window: {config.rateLimit.windowMs / 1000 / 60}min</div>
                <div>Max: {config.rateLimit.maxRequests}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
};

export default SecurityDashboard;
