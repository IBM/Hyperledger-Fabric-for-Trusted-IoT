# Upgrading Chaincode

You should change the file cc.go under artifacts/chaincode/iot_chaincode

```bash
    kubectl apply -f copy_chaincode_version.yaml
    pod=$(kubectl get pods --selector=job-name=copychaincodeversion --output=jsonpath={.items..metadata.name})
    kubectl cp ../../artifacts/chaincode $pod:/shared/artifacts
    kubectl get pods -w
```

After your copychaincodeversion pod become completed, you can continue with the following step.

**You must change the version of chaincode everytime according to new version inside chaincode_install_version.yaml and chaincode_upgrade_version.yaml**

```bash
    kubectl apply -f chaincode_install_version.yaml
    kubectl get pods -w
```

After your chaincodeinstallversion pod become completed, you can continue with the following step.

```bash
    kubectl apply -f chaincode_upgrade_version.yaml
    kubectl get pods -w
```

After your chaincodeupgradeversion pod become completed you are ready to use your new chaincode version.
