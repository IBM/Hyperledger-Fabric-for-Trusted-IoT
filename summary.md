# Short title

Build a Blockchain Network for Trusted IoT

# Long title

Use Hyperledger Fabric and Node-RED to create Blockchain Network to secure IoT data

# Author

Yigit Polat <yigit.polat@ibm.com>

# URLs

### Github repo

https://github.ibm.com/Yigit-Polat/Hyperledger-Fabric-for-Trusted-IoT

# Summary

Blockchain is an emerging technology which brings trust and transparency to the industry where the transactional processes are important. In digital transformation business, Internet of Things, or IoT, is another trending technology that refers to the billions of physical devices around the world that are now connected to the internet, collecting and sharing data. This code pattern introduces you to Hyperledger Fabric, which is an open-source blockchain framework, and Watson IoT platform with Node-RED in order to manipulate the collecting data on a distributed network immutably.

# Technologies

* [Hyperledger Fabric v1.4](https://hyperledger-fabric.readthedocs.io/en/release-1.4/) is a platform for distributed ledger solutions underpinned by a modular architecture delivering high degrees of confidentiality, resiliency, flexibility, and scalability.
* [GoLang](https://golang.org) is an open source programming language that makes it easy to build simple, reliable, and efficient software.
* [Node.js](https://nodejs.org/en/) is an open source, cross-platform runtime environment for developing server-side and networking applications.

# Description

While developing this code pattern, the goal has been set to design a proof of concept for both Blockchain and Internet of Things. Instead of developing an application with complete capabilities, this minimum valuable product is much more understandable and instructive. This code pattern can be extended and modified according to new business models by adding new organizations to the distributed network and developing new smart contracts depending on the logic. In this code pattern, you will build a Hyperledger Fabric Network where you will store IoT sensor data, such as temperature, and a user interface where you can see the history of sensor data.

When you have completed this code pattern, you will understand how to:
1. Set up an Hyperledger Fabric network
2. Design APIs with the Hyperledger Fabric SDKs to interact with the network
3. Collect data from the sensor, display it on the dashboard with Node-Red

# Flow

<p align="center"><img src="https://media.github.ibm.com/user/190275/files/557ee280-6a69-11e9-817a-b3e7e0fcc4ec"></p>


1. Watson IoT Platform input node that comes build-in with Node-RED receive events sent from devices (temperature in our case).
2. In order to invoke and query the ledger (to write and read the data) nodes inside the Node-RED perform HTTP requests and returns the response to the APIs.
3. APIs defined based on Hyperledger Fabric Client SDK for Node.js interact with the chaincode inside the Hyperledger Fabric Network and updates or reads the ledger.
4. Endorser Peers executes the functions that is defined in the chaincode according the request and sends is to the Orderer.
5. Orderer creates the blocks and sends it back to the Anchor Peers which will broadcast the blocks to the Endorser Peers.

# Instructions

1. Check installation prerequisites and clone the repo
2. Create and Access IBM Cloud Kubernetes Cluster
3. Deploy Hyperledger Fabric
4. Deploy Hyperledger Fabric SDK for Node.js
5. Deploy Node-RED

# Components and services

* [IBM Cloud Kubernetes Service](https://www.ibm.com/cloud/container-service) delivers powerful tools by combining Docker containers, the Kubernetes technology, an intuitive user experience, and built-in security and isolation to automate the deployment, operation, scaling, and monitoring of containerized apps in a cluster of compute hosts.
* [Node-RED](https://nodered.org/) is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways.


# Announcement

Blockchain is an emerging technology which brings trust and transparency to the industry where the transactional processes are important. In digital transformation business, Internet of Things, or IoT, is another trending technology that refers to the billions of physical devices around the world that are now connected to the internet, collecting and sharing data. This code pattern introduces you to Hyperledger Fabric, which is an open-source blockchain framework, and Watson IoT platform with Node-RED in order to manipulate the collecting data on a distributed network immutably.