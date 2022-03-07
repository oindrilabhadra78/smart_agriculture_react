'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        const request = {
            _name: this.roundArguments._name,
            _contact: this.roundArguments._contact
        };
        await this.sutAdapter.sendRequests(this._createInitialEthereumConnectorRequest('addConsumer', request));
    }

    _createInitialEthereumConnectorRequest(operation, args) {
        return {
            contract: 'ConsumerContract',
            verb: operation,
            args: Object.keys(args).map(k => args[k]),
            readOnly: false
        };
    }

    _createEthereumConnectorRequest(operation, args) {
        return {
            contract: 'ConsumerContract',
            verb: operation,
            args: Object.keys(args).map(k => args[k]),
            readOnly: true
        };
    }
    
    async submitTransaction() {
        const request = {
            _pos: this.roundArguments._pos
        };

        await this.sutAdapter.sendRequests(this._createEthereumConnectorRequest('getNumConsumer', request));
    }
    
    async cleanupWorkloadModule() {
        // NOOP
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
