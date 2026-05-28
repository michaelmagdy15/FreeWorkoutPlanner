#!/usr/bin/env node

/**
 * Test script to verify MCP integration is working correctly
 */

async function testMcpIntegration() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Testing MCP Integration...\n')

  // Test 1: Echo tool (basic connectivity)
  console.log('1. Testing MCP connectivity with echo tool...')
  try {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'echo',
          arguments: {
            message: 'Hello MCP server!'
          },
        },
      }),
    })

    if (response.ok) {
      const text = await response.text()
      console.log('✅ Echo test passed')
      // Parse the Server-Sent Events format
      const dataMatch = text.match(/data: (.+)/)
      if (dataMatch) {
        const data = JSON.parse(dataMatch[1])
        console.log('📝 Response:', data.result?.content?.[0]?.text)
      }
    } else {
      console.log('❌ Echo test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Echo test error:', error.message)
  }

  // Test 2: Context viewer tool
  console.log('\n2. Testing context viewer tool...')
  try {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'view-context',
          arguments: {
            userId: 'test-user'
          },
        },
      }),
    })

    if (response.ok) {
      const text = await response.text()
      console.log('✅ Context viewer test passed')
      const dataMatch = text.match(/data: (.+)/)
      if (dataMatch) {
        const data = JSON.parse(dataMatch[1])
        console.log('📊 Context data preview:', data.result?.content?.[0]?.text?.substring(0, 200) + '...')
      }
    } else {
      console.log('❌ Context viewer test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Context viewer test error:', error.message)
  }

  // Test 3: Log workout tool
  console.log('\n3. Testing workout logger tool...')
  try {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'log-workout',
          arguments: {
            userId: 'test-user',
            date: new Date().toISOString().split('T')[0],
            type: 'Push-ups',
            duration: 10,
          },
        },
      }),
    })

    if (response.ok) {
      const text = await response.text()
      console.log('✅ Workout logger test passed')
      const dataMatch = text.match(/data: (.+)/)
      if (dataMatch) {
        const data = JSON.parse(dataMatch[1])
        console.log('📝 Response:', data.result?.content?.[0]?.text?.substring(0, 100) + '...')
      }
    } else {
      console.log('❌ Workout logger test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Workout logger test error:', error.message)
  }

  // Test 4: API Integration Test
  console.log('\n4. Testing API integration...')
  try {
    const response = await fetch(`${baseUrl}/api/context?userId=test-user`)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API integration test passed')
      console.log('📊 API response preview:', JSON.stringify(data).substring(0, 200) + '...')
    } else {
      console.log('❌ API integration test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ API integration test error:', error.message)
  }

  console.log('\n🏁 Testing complete!')
}

testMcpIntegration().catch(console.error) 