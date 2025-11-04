const hre = require('hardhat');

async function main() {
  // Get contract address and owner from environment or use defaults
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];
  const ownerAddress = process.env.OWNER_ADDRESS || process.argv[3];
  
  if (!contractAddress || !ownerAddress) {
    console.error('Usage: CONTRACT_ADDRESS=<address> OWNER_ADDRESS=<address> npx hardhat run scripts/verify-only.cjs --network base');
    console.error('OR: npx hardhat verify --network base <CONTRACT_ADDRESS> <OWNER_ADDRESS>');
    console.error('Example: npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96');
    process.exit(1);
  }
  
  const networkName = hre.network.name;
  
  console.log('📋 Verification Parameters:');
  console.log('Network:', networkName);
  console.log('Contract Address:', contractAddress);
  console.log('Owner Address:', ownerAddress);
  
  // Retry logic for verification
  const maxRetries = 5;
  let verificationSuccess = false;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔍 Verification attempt ${attempt}/${maxRetries}...`);
      
      await hre.run('verify:verify', {
        address: contractAddress,
        constructorArguments: [ownerAddress],
        contract: 'src/RewardToken.sol:RewardToken',
      });
      
      console.log('✅ Contract verified successfully on BaseScan!');
      verificationSuccess = true;
      break;
    } catch (error) {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.toLowerCase().includes('already verified')) {
        console.log('✅ Contract is already verified on BaseScan!');
        verificationSuccess = true;
        break;
      }
      
      if (errorMessage.toLowerCase().includes('timeout') || 
          errorMessage.toLowerCase().includes('connect timeout') ||
          errorMessage.toLowerCase().includes('network request failed')) {
        console.log(`⚠️  Attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 5000; // Exponential backoff
          console.log(`⏳ Waiting ${waitTime / 1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('❌ All verification attempts failed due to timeout.');
          console.log('\n💡 Suggestions:');
          console.log('1. Check your internet connection');
          console.log('2. Verify your BaseScan API key is correct in .env file');
          console.log('3. Try again later (BaseScan may be experiencing high load)');
          console.log('4. Manually verify using BaseScan website:');
          console.log(`   https://basescan.org/address/${contractAddress}#code`);
        }
      } else {
        // Other errors
        console.error('❌ Verification failed:', errorMessage);
        break;
      }
    }
  }
  
  console.log(`\n📄 View contract: https://basescan.org/address/${contractAddress}`);
  
  if (!verificationSuccess) {
    console.log('\n💻 Alternative verification methods:');
    console.log(`1. Direct command: npx hardhat verify --network ${networkName} ${contractAddress} ${ownerAddress}`);
    console.log(`2. BaseScan website: https://basescan.org/address/${contractAddress}#code`);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  });

