// Simple test to check API connectivity
console.log('Testing API connectivity...');

// Test 1: Check if backend is responding
fetch('http://localhost:8000/api/auth/demo-token/')
  .then(response => response.json())
  .then(data => {
    console.log('✓ Demo token endpoint working:', data);
    
    const token = data.token;
    
    // Test 2: Check learning API with token
    return fetch('http://localhost:8000/api/learning/api/courses/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('✓ Learning API working:', data);
  })
  .catch(error => {
    console.error('✗ API test failed:', error);
  });
