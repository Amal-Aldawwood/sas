import React, { useState } from 'react';
import Link from 'next/link';

interface DebugInfo {
  tenantParam?: string;
  apiUrl?: string;
  responseStatus?: number;
  receivedData?: any;
  errorResponse?: string;
  currentUrl?: string;
  hostname?: string;
  pathname?: string;
  validationFailed?: boolean;
  invalidFormat?: boolean;
  exception?: string;
  missingParam?: boolean;
  [key: string]: any;
}

interface TenantNotFoundProps {
  debugInfo: DebugInfo;
  showDebug?: boolean;
}

const TenantNotFound: React.FC<TenantNotFoundProps> = ({ debugInfo, showDebug = true }) => {
  const [showAllDebug, setShowAllDebug] = useState(false);
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  // Function to test tenant API availability
  const testTenantApi = async () => {
    setTestingInProgress(true);
    const results: {[key: string]: boolean} = {};
    
    try {
      // Test 1: Check if we can access the debug API
      try {
        const debugResponse = await fetch('/api/debug/tenants');
        results.debugApiAccessible = debugResponse.ok;
      } catch (e) {
        results.debugApiAccessible = false;
      }
      
      // Test 2: Check if we can access known tenants
      try {
        const alnajahResponse = await fetch('/api/alnajah/auth/tenant-info');
        results.knownTenantAccessible = alnajahResponse.ok;
      } catch (e) {
        results.knownTenantAccessible = false;
      }
      
      // Test 3: Check if the current tenant parameter is recognized
      if (debugInfo.tenantParam) {
        try {
          const currentTenantResponse = await fetch(`/api/${debugInfo.tenantParam}/auth/tenant-info`);
          results.currentTenantRecognized = currentTenantResponse.ok;
        } catch (e) {
          results.currentTenantRecognized = false;
        }
      }
      
      setTestResults(results);
    } finally {
      setTestingInProgress(false);
    }
  };
  
  // Determine what might be causing the error
  const diagnoseIssue = () => {
    if (debugInfo.validationFailed) {
      return "The tenant subdomain was not found in the database.";
    }
    
    if (debugInfo.missingParam) {
      return "No tenant parameter was provided in the URL.";
    }
    
    if (debugInfo.invalidFormat) {
      return "The tenant data was returned in an invalid format.";
    }
    
    if (debugInfo.responseStatus === 404) {
      return "The tenant API endpoint could not be found (404).";
    }
    
    if (debugInfo.exception) {
      return "An exception occurred while trying to load the tenant data.";
    }
    
    return "The requested client doesn't exist or there was an issue loading it.";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Client not found</h1>
        <p className="mt-2 text-lg text-gray-600">
          {diagnoseIssue()}
        </p>
      </div>
      
      {showDebug && (
        <div className="w-full max-w-3xl bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-sm text-left mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
            <button 
              onClick={() => testTenantApi()} 
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              disabled={testingInProgress}
            >
              {testingInProgress ? 'Testing...' : 'Run Diagnostics'}
            </button>
          </div>
          
          {/* Display test results if available */}
          {Object.keys(testResults).length > 0 && (
            <div className="mb-4 p-3 bg-white rounded border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Diagnostic Results:</h3>
              <ul className="space-y-1">
                {Object.entries(testResults).map(([test, result]) => (
                  <li key={test} className="flex items-center text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result ? '✓' : '✗'}
                    </span>
                    <span>
                      {test === 'debugApiAccessible' && 'Debug API is accessible'}
                      {test === 'knownTenantAccessible' && 'Known tenant (alnajah) is accessible'}
                      {test === 'currentTenantRecognized' && `Current tenant (${debugInfo.tenantParam}) is recognized`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="overflow-auto text-sm font-mono bg-white p-3 rounded border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Tenant Parameter:</strong> {debugInfo.tenantParam || 'unknown'}</p>
              <p><strong>Response Status:</strong> {debugInfo.responseStatus || 'unknown'}</p>
              <p><strong>Current URL:</strong> {debugInfo.currentUrl || (typeof window !== 'undefined' ? window.location.href : 'unknown')}</p>
              <p><strong>Current Hostname:</strong> {debugInfo.hostname || (typeof window !== 'undefined' ? window.location.hostname : 'unknown')}</p>
              <p><strong>Current Pathname:</strong> {debugInfo.pathname || (typeof window !== 'undefined' ? window.location.pathname : 'unknown')}</p>
              <p><strong>API URL:</strong> {debugInfo.apiUrl || 'unknown'}</p>
            </div>
            
            {/* Show validation errors if any */}
            {(debugInfo.validationFailed || debugInfo.invalidFormat || debugInfo.missingParam) && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded">
                <strong>Validation Errors:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {debugInfo.validationFailed && <li>Tenant validation failed</li>}
                  {debugInfo.invalidFormat && <li>Invalid data format returned</li>}
                  {debugInfo.missingParam && <li>Missing tenant parameter</li>}
                </ul>
              </div>
            )}
            
            {debugInfo.exception && (
              <div className="mt-3">
                <strong>Exception:</strong>
                <div className="bg-red-50 p-2 rounded mt-1 border border-red-100 text-xs overflow-auto">
                  {debugInfo.exception}
                </div>
              </div>
            )}
            
            {debugInfo.errorResponse && (
              <div className="mt-3">
                <strong>Error Response:</strong>
                <div className="bg-red-50 p-2 rounded mt-1 border border-red-100 text-xs overflow-auto">
                  {debugInfo.errorResponse}
                </div>
              </div>
            )}
            
            {/* Toggle to show all debug info */}
            <div className="mt-3">
              <button 
                onClick={() => setShowAllDebug(!showAllDebug)} 
                className="text-blue-600 hover:underline text-xs"
              >
                {showAllDebug ? 'Hide' : 'Show'} all debug information
              </button>
              
              {showAllDebug && (
                <div className="mt-2 bg-gray-50 p-2 rounded text-xs border border-gray-200 overflow-auto max-h-60">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
              <h3 className="font-semibold text-blue-800">Try navigating to:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <a href="/" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Home Page</a>
                <a href="/admin/dashboard" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Admin Dashboard</a>
                <a href="/tenant/alnajah/dashboard" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Alnajah Dashboard</a>
                <a href="/tenant/almajd/dashboard" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Almajd Dashboard</a>
                <a href="/test-routing" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Routing Test Page</a>
                <a href="/api/debug/tenants" className="px-3 py-2 bg-white text-blue-600 rounded border border-blue-200 hover:bg-blue-50 text-sm text-center">Debug API - All Tenants</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantNotFound;
