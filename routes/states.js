/**
 * State Routes
 * Provides state information and DMV locations
 */

const express = require('express');

const router = express.Router();

// DMV locations for each state
const dmvLocations = {
  CA: [
    {
      name: 'Los Angeles DMV',
      address: '3615 S Hope St',
      city: 'Los Angeles',
      zipCode: '90007'
    },
    {
      name: 'San Francisco DMV',
      address: '1377 Fell St',
      city: 'San Francisco',
      zipCode: '94117'
    },
    {
      name: 'San Diego DMV',
      address: '3960 Normal St',
      city: 'San Diego',
      zipCode: '92103'
    }
  ],
  TX: [
    {
      name: 'Houston DPS',
      address: '1800 St James Pl',
      city: 'Houston',
      zipCode: '77056'
    },
    {
      name: 'Dallas DPS',
      address: '10031 Forest Ln',
      city: 'Dallas',
      zipCode: '75243'
    },
    {
      name: 'Austin DPS',
      address: '5805 N Lamar Blvd',
      city: 'Austin',
      zipCode: '78752'
    }
  ],
  FL: [
    {
      name: 'Miami DMV',
      address: '401 NW 2nd Ave',
      city: 'Miami',
      zipCode: '33128'
    },
    {
      name: 'Orlando DMV',
      address: '5319 E Colonial Dr',
      city: 'Orlando',
      zipCode: '32807'
    },
    {
      name: 'Tampa DMV',
      address: '3815 W Waters Ave',
      city: 'Tampa',
      zipCode: '33614'
    }
  ],
  NY: [
    {
      name: 'Manhattan DMV',
      address: '366 W 31st St',
      city: 'New York',
      zipCode: '10001'
    },
    {
      name: 'Brooklyn DMV',
      address: '625 Atlantic Ave',
      city: 'Brooklyn',
      zipCode: '11217'
    },
    {
      name: 'Queens DMV',
      address: '168-35 Rockaway Blvd',
      city: 'Jamaica',
      zipCode: '11434'
    }
  ]
};

// State requirements information
const stateRequirements = {
  CA: {
    name: 'California',
    minAge: 16,
    requiredDocuments: ['Proof of identity', 'Social Security Number', 'Proof of residency'],
    testRequirements: ['Written test', 'Vision test', 'Behind-the-wheel test'],
    fees: { written: 38, road: 38, renewal: 41 }
  },
  TX: {
    name: 'Texas',
    minAge: 16,
    requiredDocuments: ['Proof of identity', 'Social Security Number', 'Proof of residency'],
    testRequirements: ['Written test', 'Vision test', 'Behind-the-wheel test'],
    fees: { written: 25, road: 25, renewal: 33 }
  },
  FL: {
    name: 'Florida',
    minAge: 15,
    requiredDocuments: ['Proof of identity', 'Social Security Number', 'Proof of residency'],
    testRequirements: ['Written test', 'Vision test', 'Behind-the-wheel test'],
    fees: { written: 48, road: 48, renewal: 48 }
  },
  NY: {
    name: 'New York',
    minAge: 16,
    requiredDocuments: ['Proof of identity', 'Social Security Number', 'Proof of residency'],
    testRequirements: ['Written test', 'Vision test', 'Behind-the-wheel test'],
    fees: { written: 10, road: 10, renewal: 64.50 }
  }
};

// @route   GET /api/states
// @desc    List all supported states
// @access  Public
router.get('/', (req, res) => {
  res.json({
    states: Object.keys(stateRequirements).map(code => ({
      code,
      name: stateRequirements[code].name
    }))
  });
});

// @route   GET /api/states/:stateCode
// @desc    Get state information and requirements
// @access  Public
router.get('/:stateCode', (req, res) => {
  const { stateCode } = req.params;
  const upperCode = stateCode.toUpperCase();

  if (!stateRequirements[upperCode]) {
    return res.status(404).json({ message: 'State not found' });
  }

  res.json({
    code: upperCode,
    ...stateRequirements[upperCode]
  });
});

// @route   GET /api/states/:stateCode/locations
// @desc    Get DMV locations for a state
// @access  Public
router.get('/:stateCode/locations', (req, res) => {
  const { stateCode } = req.params;
  const upperCode = stateCode.toUpperCase();

  if (!dmvLocations[upperCode]) {
    return res.status(404).json({ message: 'State not found' });
  }

  res.json({
    state: upperCode,
    locations: dmvLocations[upperCode]
  });
});

module.exports = router;


