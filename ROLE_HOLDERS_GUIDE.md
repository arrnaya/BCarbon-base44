# Querying Role Holders in B-Carbon Platform

## Overview

The B-Carbon platform has several role-based access controls. Here's how to find out which wallets hold specific roles.

## Role Types

1. **Governance Owner** - Can approve projects, add/remove validators/verifiers
2. **Validators** - Can validate projects (first step in approval process)
3. **Verifiers** - Can verify projects (second step in approval process)  
4. **VVBs (Validation and Verification Bodies)** - Project-specific validators/verifiers
5. **Project Owners** - Own specific carbon credit projects

---

## Smart Contract Methods

### 1. Get All Validators

**Contract:** `Governance.sol` (0x2D494C3C279628f3F923fEA0Ee0b5e156b505029)

**Method:**
```solidity
function getAuthorizedValidators() external view returns(address[] memory)
```

**Usage (ethers.js):**
```javascript
const governanceContract = new ethers.Contract(
  GOVERNANCE_ADDRESS,
  governanceABI,
  provider
);

const validators = await governanceContract.getAuthorizedValidators();
console.log("Authorized Validators:", validators);
```

---

### 2. Get All Verifiers

**Contract:** `Governance.sol`

**Method:**
```solidity
function getAuthorizedVerifiers() external view returns(address[] memory)
```

**Usage:**
```javascript
const verifiers = await governanceContract.getAuthorizedVerifiers();
console.log("Authorized Verifiers:", verifiers);
```

---

### 3. Check if Address is Validator

**Contract:** `Governance.sol`

**Method:**
```solidity
function checkAuthorizedValidators(address _validator) external view returns (bool)
```

**Usage:**
```javascript
const isValidator = await governanceContract.checkAuthorizedValidators("0x...");
console.log("Is Validator:", isValidator);
```

---

### 4. Check if Address is Verifier

**Contract:** `Governance.sol`

**Method:**
```solidity
function checkAuthorizedVerifiers(address _verifier) external view returns (bool)
```

**Usage:**
```javascript
const isVerifier = await governanceContract.checkAuthorizedVerifiers("0x...");
console.log("Is Verifier:", isVerifier);
```

---

### 5. Get Project-Specific VVBs

**Contract:** `ProjectData.sol` (0x3155397FA6746A60c861BB99f70c65603f1Db6c0)

**Method:**
```solidity
function getAuthorizedVVBs(address projectAddress) external view returns (address[] memory)
```

**Usage:**
```javascript
const projectDataContract = new ethers.Contract(
  PROJECT_DATA_ADDRESS,
  projectDataABI,
  provider
);

const projectVVBs = await projectDataContract.getAuthorizedVVBs(projectAddress);
console.log("Project VVBs:", projectVVBs);
```

---

### 6. Check if Address is Project VVB

**Contract:** `ProjectData.sol`

**Method:**
```solidity
function checkAuthorizedVVBs(address projectContract, address vvb) external view returns(bool)
```

**Usage:**
```javascript
const isProjectVVB = await projectDataContract.checkAuthorizedVVBs(
  projectAddress,
  vvbAddress
);
console.log("Is Project VVB:", isProjectVVB);
```

---

### 7. Get Governance Owner

**Contract:** `Governance.sol` (inherits from Ownable)

**Method:**
```solidity
function owner() external view returns (address)
```

**Usage:**
```javascript
const governanceOwner = await governanceContract.owner();
console.log("Governance Owner:", governanceOwner);
```

---

### 8. Get Project Owner

**Contract:** Individual BCO2 project contracts

**Method:**
```solidity
function owner() external view returns (address)
```

**Usage:**
```javascript
const bco2Contract = new ethers.Contract(
  projectAddress,
  bco2ABI,
  provider
);

const projectOwner = await bco2Contract.owner();
console.log("Project Owner:", projectOwner);
```

---

## Frontend Integration Example

Here's how to create a component that displays all role holders:

```javascript
// src/components/admin/RoleHolders.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  GOVERNANCE_ADDRESS, 
  PROJECT_DATA_ADDRESS 
} from '@/components/contract/address';

export default function RoleHolders() {
  const [validators, setValidators] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoleHolders();
  }, []);

  const loadRoleHolders = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      
      const governanceContract = new ethers.Contract(
        GOVERNANCE_ADDRESS,
        GOVERNANCE_ABI,
        provider
      );

      // Get all validators
      const validatorsList = await governanceContract.getAuthorizedValidators();
      setValidators(validatorsList);

      // Get all verifiers
      const verifiersList = await governanceContract.getAuthorizedVerifiers();
      setVerifiers(verifiersList);

      // Get governance owner
      const ownerAddress = await governanceContract.owner();
      setOwner(ownerAddress);

      setLoading(false);
    } catch (error) {
      console.error('Error loading role holders:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Role Holders</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Governance Owner</h3>
          <p className="font-mono text-sm">{owner}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Validators ({validators.length})
          </h3>
          <ul className="space-y-2">
            {validators.map((validator, index) => (
              <li key={index} className="font-mono text-sm">
                {validator}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Verifiers ({verifiers.length})
          </h3>
          <ul className="space-y-2">
            {verifiers.map((verifier, index) => (
              <li key={index} className="font-mono text-sm">
                {verifier}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## Using ContractInteraction Helper

If you're using the existing `ContractInteraction.jsx` helper, you can add these methods:

```javascript
// Add to ContractInteraction.jsx

/**
 * Get all authorized validators
 */
const getAuthorizedValidators = async () => {
  try {
    const governanceContract = await getGovernanceContract();
    const validators = await governanceContract.getAuthorizedValidators();
    return validators;
  } catch (error) {
    console.error('Error getting validators:', error);
    throw error;
  }
};

/**
 * Get all authorized verifiers
 */
const getAuthorizedVerifiers = async () => {
  try {
    const governanceContract = await getGovernanceContract();
    const verifiers = await governanceContract.getAuthorizedVerifiers();
    return verifiers;
  } catch (error) {
    console.error('Error getting verifiers:', error);
    throw error;
  }
};

/**
 * Check if address is validator
 */
const checkIsValidator = async (address) => {
  try {
    const governanceContract = await getGovernanceContract();
    const isValidator = await governanceContract.checkAuthorizedValidators(address);
    return isValidator;
  } catch (error) {
    console.error('Error checking validator:', error);
    return false;
  }
};

/**
 * Check if address is verifier
 */
const checkIsVerifier = async (address) => {
  try {
    const governanceContract = await getGovernanceContract();
    const isVerifier = await governanceContract.checkAuthorizedVerifiers(address);
    return isVerifier;
  } catch (error) {
    console.error('Error checking verifier:', error);
    return false;
  }
};

/**
 * Get project-specific VVBs
 */
const getProjectVVBs = async (projectAddress) => {
  try {
    const projectDataContract = await getProjectDataContract();
    const vvbs = await projectDataContract.getAuthorizedVVBs(projectAddress);
    return vvbs;
  } catch (error) {
    console.error('Error getting project VVBs:', error);
    throw error;
  }
};
```

---

## Quick CLI Commands

You can also query these directly using cast (from Foundry):

```bash
# Get all validators
cast call 0x2D494C3C279628f3F923fEA0Ee0b5e156b505029 \
  "getAuthorizedValidators()(address[])" \
  --rpc-url https://bsc-testnet.drpc.org

# Get all verifiers
cast call 0x2D494C3C279628f3F923fEA0Ee0b5e156b505029 \
  "getAuthorizedVerifiers()(address[])" \
  --rpc-url https://bsc-testnet.drpc.org

# Get governance owner
cast call 0x2D494C3C279628f3F923fEA0Ee0b5e156b505029 \
  "owner()(address)" \
  --rpc-url https://bsc-testnet.drpc.org

# Check if address is validator
cast call 0x2D494C3C279628f3F923fEA0Ee0b5e156b505029 \
  "checkAuthorizedValidators(address)(bool)" \
  0xYourAddressHere \
  --rpc-url https://bsc-testnet.drpc.org
```

---

## Summary

**To find role holders:**

| Role | Contract | Method |
|------|----------|--------|
| Governance Owner | Governance | `owner()` |
| All Validators | Governance | `getAuthorizedValidators()` |
| All Verifiers | Governance | `getAuthorizedVerifiers()` |
| Check Validator | Governance | `checkAuthorizedValidators(address)` |
| Check Verifier | Governance | `checkAuthorizedVerifiers(address)` |
| Project VVBs | ProjectData | `getAuthorizedVVBs(address)` |
| Project Owner | BCO2 Contract | `owner()` |

All these methods are **view functions** (read-only), so they don't require gas and can be called without a wallet connection.
