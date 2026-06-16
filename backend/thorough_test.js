import dotenv from 'dotenv'
import { SignJWT } from 'jose'

dotenv.config()
const PORT = process.env.PORT || 5000
const BASE_URL = `http://localhost:${PORT}/api/v1`

async function runTests() {
  console.log('=== STARTING THOROUGH USER API FLOW TESTS ===\n')
  const uniqueEmail = `tester_${Math.random().toString(36).substring(2, 9)}@example.com`
  const testPassword = 'testpassword123'
  const testName = 'Ultimate Tester'
  
  let token = null
  let userId = null

  // 1. SIGNUP TEST
  try {
    console.log(`[Test 1] Signing up user: ${uniqueEmail}...`)
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: uniqueEmail, password: testPassword })
    })
    
    if (res.status !== 201) {
      throw new Error(`Signup failed with status ${res.status}: ${await res.text()}`)
    }
    
    const data = await res.json()
    token = data.token
    userId = data.user.id
    console.log('✅ Signup Successful! User ID:', userId)
    console.log('Token generated:', token.substring(0, 15) + '...')
  } catch (err) {
    console.error('❌ Test 1 Signup Failed:', err.message)
    return
  }

  // 2. AUTH CHECK (GET /me) TEST
  try {
    console.log('\n[Test 2] Verifying auth /me session retrieval...')
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (res.status !== 200) {
      throw new Error(`Auth check failed with status ${res.status}: ${await res.text()}`)
    }
    
    const data = await res.json()
    if (data.user.email !== uniqueEmail || data.user.name !== testName) {
      throw new Error(`User data mismatch! Returned name: ${data.user.name}`)
    }
    console.log('✅ Auth check successful! Retrieved user:', data.user.name)
  } catch (err) {
    console.error('❌ Test 2 Auth Check Failed:', err.message)
  }

  // 3. PROFILE UPDATE TEST
  try {
    console.log('\n[Test 3] Updating user profile...')
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bio: 'Sadhana practitioner', location: 'Himalayas', activeSankalpa: 'mindfulness' })
    })
    
    if (res.status !== 200) {
      throw new Error(`Profile update failed with status ${res.status}: ${await res.text()}`)
    }
    
    const data = await res.json()
    if (data.user.bio !== 'Sadhana practitioner' || data.user.location !== 'Himalayas') {
      throw new Error('Profile update was not persisted correctly in returned user object!')
    }
    console.log('✅ Profile updated successfully! Updated bio:', data.user.bio)
  } catch (err) {
    console.error('❌ Test 3 Profile Update Failed:', err.message)
  }

  // 4. WATER METRICS TEST
  try {
    console.log('\n[Test 4] Testing water tracker log features...')
    const today = new Date().toISOString().split('T')[0]
    
    // Set Goal
    const goalRes = await fetch(`${BASE_URL}/water`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ waterGoal: 3000 })
    })
    if (goalRes.status !== 200) throw new Error('Failed to set water goal')

    // Add entry
    const entryRes = await fetch(`${BASE_URL}/water`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        date: today, 
        entry: { id: 'w1', time: '10:00', amount: 250 } 
      })
    })
    if (entryRes.status !== 201) throw new Error('Failed to add water entry')

    // Retrieve
    const getRes = await fetch(`${BASE_URL}/water`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const waterData = await getRes.json()
    if (waterData.waterGoal !== 3000 || !waterData.logs[today] || waterData.logs[today].length === 0) {
      throw new Error(`Water logs check failed! Logs: ${JSON.stringify(waterData)}`)
    }
    console.log('✅ Water logs created, updated, and retrieved successfully!')
  } catch (err) {
    console.error('❌ Test 4 Water Metrics Failed:', err.message)
  }

  // 5. HABIT CREATION AND TOGGLE TEST
  let createdHabitId = null
  try {
    console.log('\n[Test 5] Testing habit creation and execution toggle...')
    const today = new Date().toISOString().split('T')[0]

    // Create habit
    const createRes = await fetch(`${BASE_URL}/habits`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Daily Meditation', icon: 'lotus', color: '#FF7F50', cycleLength: 7 })
    })
    if (createRes.status !== 201) {
      throw new Error(`Habit creation failed with status ${createRes.status}: ${await createRes.text()}`)
    }
    const habit = await createRes.json()
    createdHabitId = habit.id
    console.log('✅ Habit created successfully with ID:', createdHabitId)

    // Toggle habit
    const toggleRes = await fetch(`${BASE_URL}/habits`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ toggle: true, habitId: createdHabitId, date: today, time: '08:00' })
    })
    if (toggleRes.status !== 200) {
      throw new Error(`Habit toggle failed with status ${toggleRes.status}: ${await toggleRes.text()}`)
    }
    const toggleData = await toggleRes.json()
    if (!toggleData.isDone) throw new Error('Habit toggle state is not true!')
    if (toggleData.user.xp !== 25) {
      throw new Error(`Expected user XP to increase to 25, got: ${toggleData.user.xp}`)
    }
    console.log('✅ Habit successfully toggled! XP points awarded. Current user XP:', toggleData.user.xp)
  } catch (err) {
    console.error('❌ Test 5 Habit Test Failed:', err.message)
  }

  // 6. JOURNAL ENTRY TEST
  try {
    console.log('\n[Test 6] Testing journal entries...')
    const today = new Date().toISOString().split('T')[0]
    
    const journalRes = await fetch(`${BASE_URL}/journal`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        id: 'j1', 
        date: today, 
        time: '23:00', 
        text: 'Had an amazing day meditating and coding.', 
        mood: 'peaceful' 
      })
    })
    if (journalRes.status !== 201) {
      throw new Error(`Journal post failed with status ${journalRes.status}: ${await journalRes.text()}`)
    }

    const getRes = await fetch(`${BASE_URL}/journal`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const entries = await getRes.json()
    const added = entries.find(e => e.id === 'j1')
    if (!added || added.text !== 'Had an amazing day meditating and coding.') {
      throw new Error('Journal entry not found or mismatched!')
    }
    console.log('✅ Journal entry written and retrieved successfully!')
  } catch (err) {
    console.error('❌ Test 6 Journal Test Failed:', err.message)
  }

  // 7. ACHIEVEMENTS / BADGES ENG EVALUATION
  try {
    console.log('\n[Test 7] Testing achievement engine evaluation...')
    const res = await fetch(`${BASE_URL}/badges/track`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ actionType: 'breathing_completed' })
    })
    
    if (res.status !== 200) {
      throw new Error(`Badge track failed with status ${res.status}: ${await res.text()}`)
    }
    
    const data = await res.json()
    if (!data.success) throw new Error('Response success flag is false!')
    console.log('✅ Achievement engine responded successfully! Newly unlocked badges count:', data.newlyUnlocked.length)
  } catch (err) {
    console.error('❌ Test 7 Achievement Engine Test Failed:', err.message)
  }

  // 8. SECURITY - DELETE ACCOUNT & INVALID SESSION TEST
  try {
    console.log('\n[Test 8] Testing account deletion and stale token blocking...')
    
    // Delete account
    const deleteRes = await fetch(`${BASE_URL}/profile`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (deleteRes.status !== 200) {
      throw new Error(`Delete account failed with status ${deleteRes.status}: ${await deleteRes.text()}`)
    }
    console.log('✅ Account successfully deleted!')

    // Attempt request with now-invalid token
    const staleRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log('Stale token request response code:', staleRes.status)
    if (staleRes.status === 401) {
      console.log('✅ SUCCESS: Stale token correctly rejected with 401 Unauthorized!')
    } else {
      throw new Error(`Stale token should return 401, but returned: ${staleRes.status}`)
    }
  } catch (err) {
    console.error('❌ Test 8 Security Test Failed:', err.message)
  }

  console.log('\n=== ALL TESTS COMPLETED ===')
}

runTests()
