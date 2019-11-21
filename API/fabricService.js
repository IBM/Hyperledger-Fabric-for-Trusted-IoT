/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

class fabricService{

   async enrollAdmin(adminName, password) {
        try {
            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['caorg1'].url;
            const ca = new FabricCAServices(caURL);
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(adminName);
            if (adminExists) {
                console.log('An identity for the admin user \"', adminName, '\" already exists in the wallet');
                return;
            }
    
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: adminName, enrollmentSecret: password });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(adminName, identity);
            console.log('Successfully enrolled admin user \"', adminName, '\" and imported it into the wallet');
            return identity;
        } catch (error) {
            console.error(`Failed to enroll admin user  \"`, adminName, `\" : ${error}`);
            return error;
        }
    }

    async registerUser(adminName, username) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (userExists) {
                console.log('An identity for the user \"', username, '\" already exists in the wallet');
                return;
            }
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(adminName);
            if (!adminExists) {
                console.log('An identity for the admin user \"', adminName, '\" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: adminName, discovery: { enabled: false } });
    
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
    
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(username, userIdentity);
            console.log('Successfully registered and enrolled admin user \"', username, '\" and imported it into the wallet');
            return userIdentity;
        } catch (error) {
            console.error(`Failed to register user \"`, username, `\": ${error}`);
            return error;
        }
    }

    async registerSensor(username, channel, smartcontract, args) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('registerSensor', args.sensorID);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Sensor registered';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async addTemp(username, channel, smartcontract, args) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('addTemp', args.sensorID, args.temp, args.time);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getHistory(username, channel, smartcontract, args) {
        try {
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            const contract = network.getContract(smartcontract);
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('getHistory', args.sensorID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            return result.toString();
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }
}

module.exports = fabricService;