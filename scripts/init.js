#!/usr/bin/env node

/**
 * Initialization script for Whoop Dashboard
 * Sets up environment and guides user through setup
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n🏃‍♂️ Whoop Dashboard - Setup Wizard\n')
  console.log('This wizard will help you set up your dashboard.\n')

  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/n): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n✅ Keeping existing .env file.')
      console.log('\n📚 Read SETUP.md for next steps!')
      rl.close()
      return
    }
  }

  console.log('\n📝 Whoop API Configuration\n')
  console.log('You need a Whoop Developer account to continue.')
  console.log('Visit: https://developer.whoop.com/dashboard\n')

  const hasAccount = await question('Do you have a Whoop Developer account? (y/n): ')
  
  if (hasAccount.toLowerCase() !== 'y') {
    console.log('\n❌ Please create a Whoop Developer account first.')
    console.log('📖 Follow the guide in SETUP.md\n')
    rl.close()
    return
  }

  console.log('\n✅ Great! Let\'s configure your credentials.\n')

  const clientId = await question('Enter your Whoop Client ID: ')
  const clientSecret = await question('Enter your Whoop Client Secret: ')
  
  console.log('\n🌐 Environment Setup\n')
  console.log('1. Development (localhost:3000)')
  console.log('2. Production (Vercel URL)')
  
  const envType = await question('Choose environment (1 or 2): ')
  
  let redirectUri = 'http://localhost:3000/auth/callback'
  
  if (envType === '2') {
    const vercelUrl = await question('Enter your Vercel URL (without https://): ')
    redirectUri = `https://${vercelUrl}/auth/callback`
  }

  // Create .env file
  const envContent = `# Whoop API Configuration
VITE_WHOOP_CLIENT_ID=${clientId}
VITE_WHOOP_CLIENT_SECRET=${clientSecret}
VITE_WHOOP_REDIRECT_URI=${redirectUri}

# Whoop API Endpoints
VITE_WHOOP_AUTH_URL=https://api.prod.whoop.com/oauth/authorize
VITE_WHOOP_TOKEN_URL=https://api.prod.whoop.com/oauth/token
VITE_WHOOP_API_BASE=https://api.prod.whoop.com/v2
`

  fs.writeFileSync(envPath, envContent)

  console.log('\n✅ .env file created successfully!\n')
  console.log('📋 Next steps:\n')
  console.log('1. Run: npm install')
  console.log('2. Run: npm run dev')
  console.log('3. Open: http://localhost:3000')
  console.log('4. Navigate to Whoop page')
  console.log('5. Click "Verbinden met Whoop"\n')
  console.log('📚 For more details, read SETUP.md\n')
  console.log('🚀 Happy coding!\n')

  rl.close()
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  rl.close()
  process.exit(1)
})
