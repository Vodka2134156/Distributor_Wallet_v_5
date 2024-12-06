const { TonClient, WalletContractV5R1, internal,  } = require("@ton/ton");
const { mnemonicNew, mnemonicToPrivateKey } = require("@ton/crypto");
const TonWeb = require("tonweb");
const TonWebMnemonic = require("tonweb-mnemonic");
const axios = require("axios");
const core_1 = require("@ton/core");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const gas=9;  // 9 ton for message gas
const fetchAddressesAndPrepareRequests = async (apiUrl, bal) => {
    try {
        const response = await axios.get(apiUrl); // Fetch data from the API
        const addresses = response.data.addresses.slice(0, 200); // Get only the first 200 addresses

        // Filter and structure the data
        const messages = addresses
            .filter((addressData) => {
                // Convert balance from smallest units to TON (divide by 10^18)
                const balanceInTON = parseFloat(addressData.balance) / 1e15;

                

                return balanceInTON>0.1 && addressData.owner.address!="0:779dcc815138d9500e449c5291e7f12738c23d575b5310000f6a253bd607384e"; // Keep only addresses with balance > 0.01 TON and exclude stonfi pool
            })
            .map((addressData) => {
                console.log(addressData.owner.address)
                const calculatedAmount = (bal * (parseFloat(addressData.balance) / 1e17)).toFixed(9); // Ensure up to 9 decimals
                return  internal({
                    to: addressData.owner.address, // Use the address field from the API
                    value: calculatedAmount, 
                    body: ' Mixer Share', // Optional message body to replace with our ref message
                });
            });
        console.log()
        console.log('Prepared messages:', messages);
        return messages;
    } catch (error) {
        console.error('Error fetching addresses:', error.message);
        return [];
    }
};
const revshare = async()=> {
    // Create Client
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        
    });

    const apiUrl = "https://tonapi.io/v2/jettons/EQAdFbynSUlzIlh_I4fXuYaer3rvY0TG0BK-NQZ-Y871pZoM/holders?limit=1000&offset=0"; 
   
    
   
   

    let keyPair = await mnemonicToPrivateKey('word1 word2 word3....'.split(' '));
  


    // Create wallet contract
    let workchain = 0; // Usually you need a workchain 0
    let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey });
    let contract = client.open(wallet);

    // Get balance
    let balance = await contract.getBalance();
    console.log('Balance:', balance.toString());
    const messages = await fetchAddressesAndPrepareRequests(apiUrl, (parseFloat(balance)/1e9)-gas); //balance -9

    // Create a transfer
    await sleep(3000)
    let seqno = await contract.getSeqno();
    await sleep(3000)
    let transfer = contract.createTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages,
        
    });
    console.log('Transfer created:', transfer);
    await sleep(5000)
    await contract.send(transfer)
    

    
};

(async ()=>{
    revshare()
})()
module.exports={
    revshare
}