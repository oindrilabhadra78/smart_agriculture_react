'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    _createEthereumConnectorRequest(operation, args) {
        return {
            contract: 'FarmerContract',
            verb: operation,
            args: Object.keys(args).map(k => args[k]),
            readOnly: false
        };
    }
    
    async submitTransaction() {
        const request = {
            _name: this.roundArguments._name,
            _stateOfResidence: this.roundArguments._stateOfResidence,
            _gender: this.roundArguments._gender,
            _landOwned: this.roundArguments._landOwned,
            _latitude: this.roundArguments._latitude,
            _longitude: this.roundArguments._longitude,
            _hash: this.roundArguments._hash
        };

        await this.sutAdapter.sendRequests(this._createEthereumConnectorRequest('addFarmer', request));
    }
    
    async cleanupWorkloadModule() {
        // NOOP
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
