const hre = require('hardhat');
const { run } = hre;

/**
 * Verify contract with retry logic
 */
async function verifyContract(contractAddress, constructorArgs, contractPath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔍 Verification attempt ${attempt}/${maxRetries}...`);
      
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: constructorArgs,
        contract: contractPath,
      });
      
      console.log('✅ Contract verified successfully on BaseScan!');
      return true;
    } catch (error) {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.toLowerCase().includes('already verified')) {
        console.log('✅ Contract is already verified on BaseScan!');
        return true;
      }
      
      if (errorMessage.toLowerCase().includes('timeout') || 
          errorMessage.toLowerCase().includes('connect timeout') ||
          errorMessage.toLowerCase().includes('network request failed')) {
        console.log(`⚠️  Attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 5000; // Exponential backoff: 5s, 10s, 15s
          console.log(`⏳ Waiting ${waitTime / 1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('❌ All verification attempts failed due to timeout.');
          console.log('\n💡 Suggestions:');
          console.log('1. Check your internet connection');
          console.log('2. Verify your BaseScan API key is correct');
          console.log('3. Try again later (BaseScan may be experiencing high load)');
          console.log('4. Manually verify using the BaseScan website');
          return false;
        }
      } else {
        // Other errors (not timeout related)
        console.error('❌ Verification failed:', errorMessage);
        return false;
      }
    }
  }
  
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: npx hardhat run scripts/verify-contract.cjs --network base <CONTRACT_ADDRESS> <OWNER_ADDRESS> [CONTRACT_PATH]');
    console.error('Example: npx hardhat run scripts/verify-contract.cjs --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96');
    process.exit(1);
  }
  
  const contractAddress = args[0];
  const ownerAddress = args[1];
  const contractPath = args[2] || 'src/RewardToken.sol:RewardToken';
  
  // Get network name from hardhat config
  const networkName = hre.network.name;
  console.log('Network:', networkName);
  
  console.log('📋 Verification Parameters:');
  console.log('Contract Address:', contractAddress);
  console.log('Owner Address:', ownerAddress);
  console.log('Contract Path:', contractPath);
  
  const success = await verifyContract(
    contractAddress,
    [ownerAddress],
    contractPath,
    5 // 5 retries
  );
  
  if (success) {
    console.log(`\n📄 View contract: https://basescan.org/address/${contractAddress}`);
  } else {
    console.log(`\n📄 View contract: https://basescan.org/address/${contractAddress}`);
    console.log('\n💻 Manual verification command:');
    console.log(`npx hardhat verify --network base ${contractAddress} ${ownerAddress}`);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  });

