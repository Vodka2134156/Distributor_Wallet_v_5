# MIXER Token Distribution Script

This script distributes funds to holders of the MIXER token based on their percentage ownership of the total token supply. It uses wallet V5 contract and the SDK to retrieve token holder data, excludes specific addresses (e.g., the Stonfi pool), calculates each holder's percentage, and sends funds accordingly.

## Features

1. **Token Holder Identification**:
   - Retrieves a list of all MIXER token holders.
   - Excludes predefined addresses like the Stonfi pool to avoid including liquidity providers.

2. **Percentage Calculation**:
   - Calculates each holder's percentage of the total supply after removing excluded addresses.

3. **Fund Distribution**:
   - Distributes funds proportionally to holders based on their calculated percentage.

## Usage

### Prerequisites
- Ensure you have installed the necessary dependencies

