const { TonClient } = require('@ton/ton');
const { Address } = require('@ton/core');
const axios = require("axios");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Create Client
   
    const FecthLpHolders = async () => {
        const client = new TonClient({
            endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        });
    
        // Call get method
        const result = await client.runMethod(
            Address.parse('EQAUSQROzbfAEC-x0UmKBybyT35U3WRr6k5daPMizWvY8rOk'),
            'get_pool_data'
        );
        const total = result.stack.items;
        const mixerPooled=parseInt(total[0].value);
        const tonPooled=parseInt(total[1].value)
        
        const response = await axios.get(`https://tonapi.io/v2/jettons/EQAUSQROzbfAEC-x0UmKBybyT35U3WRr6k5daPMizWvY8rOk`);
        const supply = parseInt(response.data.total_supply)
        try {
            const response = await axios.get('https://tonapi.io/v2/jettons/EQAUSQROzbfAEC-x0UmKBybyT35U3WRr6k5daPMizWvY8rOk/holders?limit=1000&offset=0');
            console.log(response) // Fetch data from the API
            const addresses = response.data.addresses.slice(0, 200); // Get only the first 200 addresses
    
            // Filter and structure the data
            const messages = addresses
                .filter((addressData) => {
                    // Convert balance from smallest units to TON (divide by 10^18)
                    
    
                    
    
                    return  addressData.owner.address!="0:0000000000000000000000000000000000000000000000000000000000000000"; // Keep only addresses with balance > 0.01 TON and exclude stonfi pool
                })
                .map((addressData) => {
                    const percent = parseFloat(addressData.balance) / supply;
                    console.log(addressData.owner.address)
                    const calculatedAmount = mixerPooled*percent; //calculate amount of mixer equivalent to how much they have.
                    addressData.balance=calculatedAmount // edited it so it can be later added to the holders of mixer
                    return  addressData
                });
            console.log()
            console.log('Prepared messages:', messages);
            return messages;
        } catch (error) {
            console.error('Error fetching addresses:', error.message);
            return [];
        }
    };
    



module.exports={
    FecthLpHolders
}