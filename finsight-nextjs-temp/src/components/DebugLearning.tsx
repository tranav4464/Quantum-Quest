'use client';

import { useEffect, useState } from 'react';
import { learningService } from '@/services/learningService';

export default function DebugLearning() {
  const [status, setStatus] = useState<string>('Starting...');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const runTests = async () => {
      const testResults: any[] = [];
      
      try {
        setStatus('Testing demo authentication...');
        
        // Test 1: Initialize auth
        await learningService.initializeAuth();
        testResults.push({ test: 'Initialize Auth', result: 'Success' });
        
        setStatus('Testing courses API...');
        
        // Test 2: Get courses
        const courses = await learningService.getCourses();
        testResults.push({ test: 'Get Courses', result: `Success - ${courses.length} courses found` });
        
        setStatus('Testing progress API...');
        
        // Test 3: Get progress
        const progress = await learningService.getUserProgress();
        testResults.push({ test: 'Get Progress', result: `Success - ${progress.length} progress items` });
        
        setStatus('All tests completed successfully!');
        setResults(testResults);
        
      } catch (error: any) {
        testResults.push({ test: 'Failed', result: error.message });
        setStatus(`Test failed: ${error.message}`);
        setResults(testResults);
      }
    };
    
    runTests();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-4">Learning API Debug Test</h3>
      <p className="mb-4">Status: {status}</p>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-white rounded border">
            <strong>{result.test}:</strong> {result.result}
          </div>
        ))}
      </div>
    </div>
  );
}
