'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null);

  const testAPI = async () => {
    try {
      setTestResult({ status: 'testing...' });
      
      const response = await fetch('/api/health');
      const data = await response.json();
      
      setTestResult({
        status: 'success',
        statusCode: response.status,
        data
      });
    } catch (error: any) {
      setTestResult({
        status: 'error',
        message: error.message,
        error: error.toString()
      });
    }
  };

  const testLogin = async () => {
    try {
      setTestResult({ status: 'testing login...' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'sarah.landlord@example.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      setTestResult({
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        data
      });
    } catch (error: any) {
      setTestResult({
        status: 'error',
        message: error.message,
        error: error.toString()
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Debug Page</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Variables</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Tests</h2>
        <button onClick={testAPI} style={{ padding: '10px', marginRight: '10px' }}>
          Test Health API
        </button>
        <button onClick={testLogin} style={{ padding: '10px' }}>
          Test Login API
        </button>
      </div>

      {testResult && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
