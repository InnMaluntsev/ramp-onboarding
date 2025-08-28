"use client";

import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiPlay, FiCode, FiTerminal, FiCheck, FiLock, FiUnlock } from 'react-icons/fi';

interface ApiBuilderComponentProps {
  onValidationComplete?: (isComplete: boolean) => void;
}

const ApiBuilderComponent: React.FC<ApiBuilderComponentProps> = ({ onValidationComplete }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/capabilities');
  const [userResponse, setUserResponse] = useState('');
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [enabledOptionalEndpoints, setEnabledOptionalEndpoints] = useState<Set<string>>(new Set());

  const mandatoryEndpoints = [
    {
      method: 'GET',
      path: '/capabilities',
      description: 'Get server capabilities and supported features',
      category: 'mandatory'
    },
    {
      method: 'GET',
      path: '/accounts',
      description: 'Get list of sub-accounts',
      category: 'mandatory'
    },
    {
      method: 'GET', 
      path: '/capabilities/assets',
      description: 'Get list of supported additional assets',
      category: 'mandatory'
    }
  ];

  const optionalEndpoints = [
    {
      method: 'GET',
      path: '/accounts/{accountId}/balances',
      displayPath: 'GET /accounts/{accountId}/balances',
      description: 'Get current balances for a specific account',
      category: 'optional'
    },
    {
      method: 'GET',
      path: '/accounts/{accountId}/rate',
      displayPath: 'GET /accounts/{accountId}/rate',
      description: 'Get real-time rates for asset pairs',
      category: 'rates'
    },
    {
      method: 'GET',
      path: '/accounts/{accountId}/capabilities/ramps',
      displayPath: 'GET /accounts/{accountId}/capabilities/ramps',
      description: 'Get list of supported ramp methods',
      category: 'ramp'
    },
    {
      method: 'POST',
      path: '/accounts/{accountId}/ramps',
      displayPath: 'POST /accounts/{accountId}/ramps',
      description: 'Create a new ramp transaction',
      category: 'ramp'
    },
    {
      method: 'GET',
      path: '/accounts/{accountId}/ramps',
      displayPath: 'GET /accounts/{accountId}/ramps',
      description: 'Get list of ramp transactions',
      category: 'ramp'
    },
    {
      method: 'GET',
      path: '/accounts/{accountId}/ramps/{id}',
      displayPath: 'GET /accounts/{accountId}/ramps/{id}',
      description: 'Get details of a specific ramp transaction',
      category: 'ramp'
    }
  ];

  const allEndpoints = [...mandatoryEndpoints, ...optionalEndpoints];

  const exampleResponses: Record<string, string> = {
    '/capabilities': `{
  "version": "0.4.1",
  "components": {
    "accounts": "*",
    "balances": "*",
    "transfers": "*",
    "transfersBlockchain": "*",
    "transfersFiat": "*",
    "transfersPeerAccounts": "*",
    "trading": "*",
    "liquidity": "*",
    "ramps": "*"
  }
}`,
    '/capabilities/assets': `{
  "assets": [
    {
      "id": "usdt-ethereum",
      "type": "Erc20Token",
      "blockchain": "Ethereum",
      "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "name": "Tether USD",
      "symbol": "USDT",
      "description": "USDT stablecoin on Ethereum",
      "decimalPlaces": 6
    },
    {
      "id": "usdc-polygon",
      "type": "Erc20Token",
      "blockchain": "Polygon",
      "contractAddress": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      "name": "USD Coin",
      "symbol": "USDC",
      "description": "USDC stablecoin on Polygon",
      "decimalPlaces": 6
    }
  ]
}`,
    '/accounts': `{
  "accounts": [
    {
      "id": "main-account",
      "title": "Main Trading Account",
      "description": "Primary account for trading operations",
      "status": "active"
    },
    {
      "id": "custody-account", 
      "title": "Custody Account",
      "status": "active",
      "parentId": "main-account"
    }
  ]
}`,
    '/accounts/{accountId}/balances': `{
  "balances": [
    {
      "id": "balance-usd",
      "asset": {
        "nationalCurrencyCode": "USD"
      },
      "availableAmount": "10000.50",
      "lockedAmount": "0"
    },
    {
      "id": "balance-btc",
      "asset": {
        "cryptocurrencySymbol": "BTC",
        "blockchain": "Bitcoin"
      },
      "availableAmount": "2.50000000",
      "lockedAmount": "0"
    },
    {
      "id": "balance-usdt",
      "asset": {
        "assetId": "usdt-ethereum"
      },
      "availableAmount": "5000.000000",
      "lockedAmount": "500.000000"
    }
  ]
}`,
    '/accounts/{accountId}/rate': `{
  "rate": "0.9",
  "timestamp": 1546658861000,
  "baseAsset": {
    "nationalCurrencyCode": "USD"
  },
  "quoteAsset": {
    "nationalCurrencyCode": "EUR"
  }
}`,
    '/accounts/{accountId}/capabilities/ramps': `{
  "capabilities": [
    {
      "from": {
        "transferMethod": "Iban",
        "asset": {
          "nationalCurrencyCode": "USD"
        }
      },
      "to": {
        "transferMethod": "PublicBlockchain",
        "asset": {
          "cryptocurrencySymbol": "BTC"
        }
      },
      "type": "OnRamp",
      "orderFlows": ["Delivery", "Prefunded"],
      "pricingMethods": ["Market", "Quote"]
    },
    {
      "from": {
        "transferMethod": "PublicBlockchain",
        "asset": {
          "assetId": "usdt-ethereum"
        }
      },
      "to": {
        "transferMethod": "Iban",
        "asset": {
          "nationalCurrencyCode": "USD"
        }
      },
      "type": "OffRamp",
      "orderFlows": ["Delivery"],
      "pricingMethods": ["Market"]
    }
  ]
}`,
    '/accounts/{accountId}/ramps': `{
  "ramps": [
    {
      "id": "ramp-order-123",
      "type": "OnRamp",
      "status": "Completed",
      "amount": "1000.00",
      "createdAt": "2023-10-15T14:30:00Z",
      "expiresAt": "2023-10-15T15:30:00Z"
    },
    {
      "id": "ramp-order-124",
      "type": "OffRamp", 
      "status": "Processing",
      "amount": "500.000000",
      "createdAt": "2023-10-15T16:00:00Z"
    }
  ]
}`,
    'POST /accounts/{accountId}/ramps': `{
  "id": "ramp-order-125",
  "type": "OnRamp",
  "status": "Pending",
  "amount": "2000.00",
  "from": {
    "transferMethod": "Iban",
    "asset": {
      "nationalCurrencyCode": "USD"
    }
  },
  "to": {
    "transferMethod": "PublicBlockchain",
    "asset": {
      "cryptocurrencySymbol": "BTC"
    },
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  "paymentInstructions": {
    "transferMethod": "Iban",
    "iban": "GB33BUKB20201555555555",
    "accountHolder": {
      "name": "Fireblocks Inc",
      "address": "123 Main St, New York, NY 10001"
    },
    "referenceId": "RAMP-REF-789"
  },
  "createdAt": "2023-10-15T18:00:00Z",
  "expiresAt": "2023-10-15T19:00:00Z"
}`,
    '/accounts/{accountId}/ramps/{id}': `{
  "id": "ramp-order-123",
  "type": "OnRamp",
  "status": "Completed",
  "amount": "1000.00",
  "from": {
    "transferMethod": "Iban",
    "asset": {
      "nationalCurrencyCode": "USD"
    }
  },
  "to": {
    "transferMethod": "PublicBlockchain",
    "asset": {
      "cryptocurrencySymbol": "BTC"
    },
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  "paymentInstructions": {
    "transferMethod": "Iban",
    "iban": "GB33BUKB20201555555555",
    "accountHolder": {
      "name": "Fireblocks Inc",
      "address": "123 Main St, New York, NY 10001"
    },
    "referenceId": "RAMP-REF-789"
  },
  "receipt": {
    "transferMethod": "PublicBlockchain",
    "asset": {
      "cryptocurrencySymbol": "BTC"
    },
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "amount": "0.04567890",
    "blockchainTxId": "a1b2c3d4e5f6789012345678901234567890abcdef"
  },
  "createdAt": "2023-10-15T14:30:00Z",
  "completedAt": "2023-10-15T14:45:00Z"
}`
  };

  // Toggle optional endpoint
  const toggleOptionalEndpoint = (endpointPath: string) => {
    const newSet = new Set(enabledOptionalEndpoints);
    if (newSet.has(endpointPath)) {
      newSet.delete(endpointPath);
    } else {
      newSet.add(endpointPath);
    }
    setEnabledOptionalEndpoints(newSet);
  };

  // Get endpoints that need to be validated
  const getRequiredEndpoints = () => {
    return [
      ...mandatoryEndpoints.map(e => e.path),
      ...Array.from(enabledOptionalEndpoints)
    ];
  };

  // Validation functions
  const validateResponse = async (endpoint: string, responseText: string) => {
    setIsValidating(true);
    
    try {
      const parsedResponse = JSON.parse(responseText);
      const errors: string[] = [];
      const warnings: string[] = [];

      switch (endpoint) {
        case '/capabilities':
          validateCapabilities(parsedResponse, errors, warnings);
          break;
        case '/capabilities/assets':
          validateAssets(parsedResponse, errors, warnings);
          break;
        case '/accounts':
          validateAccounts(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/balances':
          validateBalances(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/rate':
          validateRate(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/capabilities/ramps':
          validateRampCapabilities(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/ramps':
          validateRampsList(parsedResponse, errors, warnings);
          break;
        case 'POST /accounts/{accountId}/ramps':
          validateRampOrder(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/ramps/{id}':
          validateRampDetails(parsedResponse, errors, warnings);
          break;
      }

      const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        parsedResponse,
        endpoint
      };

      setValidationResults(prev => ({
        ...prev,
        [endpoint]: result
      }));

      return result;

    } catch (error: any) {
      const result = {
        isValid: false,
        errors: [`JSON Parse Error: ${error.message}`],
        warnings: [],
        parsedResponse: null,
        endpoint
      };

      setValidationResults(prev => ({
        ...prev,
        [endpoint]: result
      }));

      return result;
    } finally {
      setIsValidating(false);
    }
  };

  const validateCapabilities = (response: any, errors: string[], warnings: string[]) => {
    if (!response.version) {
      errors.push('Missing required field: version');
    } else if (!/^\d+\.\d+\.\d+$/.test(response.version)) {
      warnings.push('Version should follow semantic versioning (e.g., "0.4.1")');
    }

    if (!response.components) {
      errors.push('Missing required field: components');
      return;
    }

    if (!response.components.accounts) {
      errors.push('Capabilities must always include "accounts" component');
    }
    if (!response.components.balances) {
      errors.push('Capabilities must always include "balances" component');
    }

    Object.entries(response.components).forEach(([key, value]) => {
      if (value !== '*' && !Array.isArray(value)) {
        errors.push(`Component "${key}" must be either "*" or an array of account IDs`);
      }
    });
  };

  const validateAssets = (response: any, errors: string[], warnings: string[]) => {
    if (!response.assets) {
      errors.push('Missing required field: assets');
      return;
    }

    if (!Array.isArray(response.assets)) {
      errors.push('Field "assets" must be an array');
      return;
    }

    response.assets.forEach((asset: any, index: number) => {
      if (!asset.id) errors.push(`Asset ${index}: Missing required "id" field`);
      if (!asset.type) errors.push(`Asset ${index}: Missing required "type" field`);
      if (!asset.name) errors.push(`Asset ${index}: Missing required "name" field`);
      if (!asset.symbol) errors.push(`Asset ${index}: Missing required "symbol" field`);
      if (typeof asset.decimalPlaces !== 'number') {
        errors.push(`Asset ${index}: "decimalPlaces" must be a number`);
      }
      
      if (asset.type === 'Erc20Token' && !asset.contractAddress) {
        errors.push(`Asset ${index}: ERC-20 tokens require "contractAddress" field`);
      }
    });
  };

  const validateAccounts = (response: any, errors: string[], warnings: string[]) => {
    if (!response.accounts) {
      errors.push('Missing required field: accounts');
      return;
    }

    if (!Array.isArray(response.accounts)) {
      errors.push('Field "accounts" must be an array');
      return;
    }

    response.accounts.forEach((account: any, index: number) => {
      if (!account.id) errors.push(`Account ${index}: Missing required "id" field`);
      if (!account.title) errors.push(`Account ${index}: Missing required "title" field`);
      if (!account.status) errors.push(`Account ${index}: Missing required "status" field`);
      
      if (account.status && !['active', 'inactive', 'suspended'].includes(account.status)) {
        errors.push(`Account ${index}: Status must be "active", "inactive", or "suspended"`);
      }
    });
  };

  const validateBalances = (response: any, errors: string[], warnings: string[]) => {
    if (!response.balances) {
      errors.push('Missing required field: balances');
      return;
    }

    if (!Array.isArray(response.balances)) {
      errors.push('Field "balances" must be an array');
      return;
    }

    response.balances.forEach((balance: any, index: number) => {
      if (!balance.id) errors.push(`Balance ${index}: Missing required "id" field`);
      if (!balance.asset) errors.push(`Balance ${index}: Missing required "asset" field`);
      if (!balance.availableAmount) errors.push(`Balance ${index}: Missing required "availableAmount" field`);
      
      if (balance.availableAmount && !/^\d+(\.\d+)?$/.test(balance.availableAmount)) {
        errors.push(`Balance ${index}: "availableAmount" must be a positive number string`);
      }
      
      if (balance.asset) {
        const hasNationalCurrency = !!balance.asset.nationalCurrencyCode;
        const hasCryptocurrency = !!balance.asset.cryptocurrencySymbol;
        const hasAssetId = !!balance.asset.assetId;
        
        const referenceCount = [hasNationalCurrency, hasCryptocurrency, hasAssetId].filter(Boolean).length;
        
        if (referenceCount !== 1) {
          errors.push(`Balance ${index}: Asset must have exactly one of nationalCurrencyCode, cryptocurrencySymbol, or assetId`);
        }
      }
    });
  };

  const validateRate = (response: any, errors: string[], warnings: string[]) => {
    if (!response.rate) {
      errors.push('Missing required field: rate');
    } else if (!/^\d+(\.\d+)?$/.test(response.rate)) {
      errors.push('Field "rate" must be a positive number string');
    }

    if (!response.timestamp) {
      errors.push('Missing required field: timestamp');
    } else if (typeof response.timestamp !== 'number') {
      errors.push('Field "timestamp" must be a number (Unix timestamp in milliseconds)');
    }

    if (!response.baseAsset) {
      errors.push('Missing required field: baseAsset');
    } else {
      validateAssetReference(response.baseAsset, 'baseAsset', errors);
    }

    if (!response.quoteAsset) {
      errors.push('Missing required field: quoteAsset');
    } else {
      validateAssetReference(response.quoteAsset, 'quoteAsset', errors);
    }
  };

  const validateAssetReference = (asset: any, fieldName: string, errors: string[]) => {
    const hasNationalCurrency = !!asset.nationalCurrencyCode;
    const hasCryptocurrency = !!asset.cryptocurrencySymbol;
    const hasAssetId = !!asset.assetId;
    
    const referenceCount = [hasNationalCurrency, hasCryptocurrency, hasAssetId].filter(Boolean).length;
    
    if (referenceCount !== 1) {
      errors.push(`${fieldName}: Asset must have exactly one of nationalCurrencyCode, cryptocurrencySymbol, or assetId`);
    }
  };

  const validateRampCapabilities = (response: any, errors: string[], warnings: string[]) => {
    if (!response.capabilities) {
      errors.push('Missing required field: capabilities');
      return;
    }

    if (!Array.isArray(response.capabilities)) {
      errors.push('Field "capabilities" must be an array');
      return;
    }

    response.capabilities.forEach((capability: any, index: number) => {
      if (!capability.type) errors.push(`Capability ${index}: Missing required "type" field`);
      if (!capability.from) errors.push(`Capability ${index}: Missing required "from" field`);
      if (!capability.to) errors.push(`Capability ${index}: Missing required "to" field`);
      
      if (capability.type && !['OnRamp', 'OffRamp', 'Bridge'].includes(capability.type)) {
        errors.push(`Capability ${index}: Type must be "OnRamp", "OffRamp", or "Bridge"`);
      }
    });
  };

  const validateRampsList = (response: any, errors: string[], warnings: string[]) => {
    if (!response.ramps) {
      errors.push('Missing required field: ramps');
      return;
    }

    if (!Array.isArray(response.ramps)) {
      errors.push('Field "ramps" must be an array');
      return;
    }

    response.ramps.forEach((ramp: any, index: number) => {
      if (!ramp.id) errors.push(`Ramp ${index}: Missing required "id" field`);
      if (!ramp.type) errors.push(`Ramp ${index}: Missing required "type" field`);
      if (!ramp.status) errors.push(`Ramp ${index}: Missing required "status" field`);
      if (!ramp.amount) errors.push(`Ramp ${index}: Missing required "amount" field`);
      
      if (ramp.status && !['Pending', 'Processing', 'Completed', 'Failed', 'Expired'].includes(ramp.status)) {
        errors.push(`Ramp ${index}: Status must be "Pending", "Processing", "Completed", "Failed", or "Expired"`);
      }
    });
  };

  const validateRampOrder = (response: any, errors: string[], warnings: string[]) => {
    if (!response.id) errors.push('Missing required "id" field');
    if (!response.type) errors.push('Missing required "type" field');
    if (!response.status) errors.push('Missing required "status" field');
    if (!response.amount) errors.push('Missing required "amount" field');
    if (!response.from) errors.push('Missing required "from" field');
    if (!response.to) errors.push('Missing required "to" field');
    
    if (response.type && !['OnRamp', 'OffRamp', 'Bridge'].includes(response.type)) {
      errors.push('Type must be "OnRamp", "OffRamp", or "Bridge"');
    }
    
    if (response.status && !['Pending', 'Processing', 'Completed', 'Failed', 'Expired'].includes(response.status)) {
      errors.push('Status must be "Pending", "Processing", "Completed", "Failed", or "Expired"');
    }
  };

  const validateRampDetails = (response: any, errors: string[], warnings: string[]) => {
    // Same as validateRampOrder but might include additional fields like receipt
    validateRampOrder(response, errors, warnings);
    
    if (response.status === 'Completed' && !response.receipt) {
      warnings.push('Completed ramps should include receipt information');
    }
  };

  const loadExample = () => {
    const key = selectedEndpoint.startsWith('POST') ? selectedEndpoint : selectedEndpoint;
    setUserResponse(exampleResponses[key] || '');
  };

  const handleValidate = async () => {
    const result = await validateResponse(selectedEndpoint, userResponse);
    
    // Check if all required endpoints are validated
    const requiredEndpoints = getRequiredEndpoints();
    const validatedEndpoints = Object.keys(validationResults).filter(
      endpoint => validationResults[endpoint]?.isValid
    );
    
    if (result.isValid) {
      validatedEndpoints.push(selectedEndpoint);
    }
    
    const uniqueValidated = Array.from(new Set(validatedEndpoints));
    const allValidated = requiredEndpoints.every(endpoint => uniqueValidated.includes(endpoint));
    
    // Notify parent component about completion status
    if (onValidationComplete) {
      onValidationComplete(allValidated);
    }
  };

  const getEndpointStatus = (endpoint: string) => {
    const result = validationResults[endpoint];
    if (!result) return 'pending';
    return result.isValid ? 'valid' : 'invalid';
  };

  const requiredEndpoints = getRequiredEndpoints();
  const allRequiredValid = requiredEndpoints.every(endpoint => 
    getEndpointStatus(endpoint) === 'valid'
  );

  const mandatoryValidCount = mandatoryEndpoints.filter(e => 
    getEndpointStatus(e.path) === 'valid'
  ).length;

  const optionalValidCount = Array.from(enabledOptionalEndpoints).filter(endpoint => 
    getEndpointStatus(endpoint) === 'valid'
  ).length;

  return (
    <div className="space-y-6 my-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">API Validation Progress</h3>
          <span className="text-sm text-gray-600">
            {mandatoryValidCount + optionalValidCount} / {requiredEndpoints.length} Complete
          </span>
        </div>
        
        {/* Mandatory Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Mandatory Endpoints</span>
            <span className="text-sm text-gray-600">{mandatoryValidCount} / {mandatoryEndpoints.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {mandatoryEndpoints.map((endpoint) => {
              const status = getEndpointStatus(endpoint.path);
              return (
                <div
                  key={endpoint.path}
                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                    status === 'valid' 
                      ? 'bg-green-100 text-green-800' 
                      : status === 'invalid'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiLock className="w-3 h-3" />
                  {status === 'valid' ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : status === 'invalid' ? (
                    <FiXCircle className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
                  )}
                  <span className="font-mono text-xs truncate">{endpoint.path}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Progress */}
        {enabledOptionalEndpoints.size > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Selected Optional Endpoints</span>
              <span className="text-sm text-gray-600">{optionalValidCount} / {enabledOptionalEndpoints.size}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from(enabledOptionalEndpoints).map((endpointPath) => {
                const status = getEndpointStatus(endpointPath);
                return (
                  <div
                    key={endpointPath}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      status === 'valid' 
                        ? 'bg-green-100 text-green-800' 
                        : status === 'invalid'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FiUnlock className="w-3 h-3" />
                    {status === 'valid' ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : status === 'invalid' ? (
                      <FiXCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
                    )}
                    <span className="font-mono text-xs truncate">{endpointPath}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {allRequiredValid && (
          <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded flex items-center gap-2">
            <FiCheck className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">All required endpoints validated! You can proceed to the next step.</span>
          </div>
        )}
      </div>

      {/* Optional Endpoints Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select Optional Endpoints to Validate</h3>
        <p className="text-sm text-gray-600">Choose which additional endpoints you want to implement and validate:</p>
        
        <div className="space-y-3">
          {/* Balances Endpoint */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enabledOptionalEndpoints.has('/accounts/{accountId}/balances')}
                onChange={() => toggleOptionalEndpoint('/accounts/{accountId}/balances')}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Account Balances</div>
                <div className="text-sm text-gray-600">GET /accounts/{'{accountId}'}/balances</div>
                <div className="text-xs text-gray-500 mt-1">Get current balances for a specific account</div>
              </div>
            </label>
          </div>

          {/* Rates Endpoint */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enabledOptionalEndpoints.has('/accounts/{accountId}/rate')}
                onChange={() => toggleOptionalEndpoint('/accounts/{accountId}/rate')}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Real-time Rates</div>
                <div className="text-sm text-gray-600">GET /accounts/{'{accountId}'}/rate</div>
                <div className="text-xs text-gray-500 mt-1">Provide your own real-time conversion rates (recommended for better pricing control)</div>
              </div>
            </label>
          </div>

          {/* RAMP Endpoints */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <h4 className="font-medium text-gray-900">RAMP Endpoints</h4>
              <p className="text-xs text-gray-500">All RAMP-related endpoints for payment processing</p>
            </div>
            <div className="space-y-2 ml-4">
              {optionalEndpoints.filter(e => e.category === 'ramp').map((endpoint) => (
                <label key={endpoint.path} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabledOptionalEndpoints.has(endpoint.path)}
                    onChange={() => toggleOptionalEndpoint(endpoint.path)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm text-blue-600">{endpoint.path}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{endpoint.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Selection for Building */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select Endpoint to Build</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {allEndpoints
            .filter(endpoint => 
              endpoint.category === 'mandatory' || enabledOptionalEndpoints.has(endpoint.path)
            )
            .map((endpoint) => {
              const status = getEndpointStatus(endpoint.path);
              const isMandatory = endpoint.category === 'mandatory';
              return (
                <button
                  key={endpoint.path}
                  onClick={() => setSelectedEndpoint(endpoint.path)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedEndpoint === endpoint.path
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      {isMandatory ? (
                        <FiLock className="w-3 h-3 text-gray-500" title="Mandatory" />
                      ) : (
                        <FiUnlock className="w-3 h-3 text-gray-500" title="Optional" />
                      )}
                      {status === 'valid' && <FiCheckCircle className="w-4 h-4 text-green-600" />}
                      {status === 'invalid' && <FiXCircle className="w-4 h-4 text-red-600" />}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-blue-600 mb-1">{endpoint.path}</div>
                  <p className="text-gray-600 text-sm">{endpoint.description}</p>
                </button>
              );
            })}
        </div>
      </div>

      {/* Response Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Build Response for {selectedEndpoint}</h3>
          <button
            onClick={loadExample}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <FiCode className="w-4 h-4" />
            Load Example
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            JSON Response
          </label>
          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Enter your JSON response here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={isValidating || !userResponse.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <FiPlay className="w-4 h-4" />
          {isValidating ? 'Validating...' : 'Validate Response'}
        </button>
      </div>

      {/* Validation Results */}
      {validationResults[selectedEndpoint] && (
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            validationResults[selectedEndpoint].isValid 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {validationResults[selectedEndpoint].isValid ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiXCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {validationResults[selectedEndpoint].isValid ? 'Response Valid!' : 'Validation Failed'}
            </span>
          </div>

          {validationResults[selectedEndpoint].errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-800 flex items-center gap-2">
                <FiXCircle className="w-4 h-4" />
                Errors ({validationResults[selectedEndpoint].errors.length})
              </h4>
              <ul className="space-y-1">
                {validationResults[selectedEndpoint].errors.map((error: string, index: number) => (
                  <li key={index} className="text-red-700 bg-red-50 p-3 rounded text-sm border border-red-200">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResults[selectedEndpoint].warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" />
                Warnings ({validationResults[selectedEndpoint].warnings.length})
              </h4>
              <ul className="space-y-1">
                {validationResults[selectedEndpoint].warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-yellow-700 bg-yellow-50 p-3 rounded text-sm border border-yellow-200">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Implementation Guidelines</h4>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• All amount fields should be strings representing positive numbers</li>
          <li>• Asset references must have exactly one of: nationalCurrencyCode, cryptocurrencySymbol, or assetId</li>
          <li>• The capabilities endpoint must always include "accounts" and "balances" components</li>
          <li>• Account status must be "active", "inactive", or "suspended"</li>
          <li>• RAMP status must be "Pending", "Processing", "Completed", "Failed", or "Expired"</li>
          <li>• Use proper decimal places: USD (2), BTC (8), USDC/USDT (6)</li>
          <li>• Include payment instructions for RAMP orders</li>
          <li>• RAMP types must be "OnRamp", "OffRamp", or "Bridge"</li>
          <li>• Rates endpoint should include timestamp in milliseconds since Unix epoch</li>
          <li>• Rate values should be positive number strings</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiBuilderComponent;