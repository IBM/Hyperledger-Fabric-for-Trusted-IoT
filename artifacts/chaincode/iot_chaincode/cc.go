package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
)

//SmartContract
type SmartContract struct {
}

//Value
type Value struct {
	SensorID string `json:"sensorID"`
	Temp     string `json:"temp"`
	Time     string `json:"time"`
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Println("Error when starting SmartContract", err)
	}
}

func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("Chaincode instantiated")
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	function, args := stub.GetFunctionAndParameters()

	if function == "registerSensor" {
		return s.registerSensor(stub, args)
	} else if function == "addTemp" {
		return s.addTemp(stub, args)
	} else if function == "getHistory" {
		return s.getHistory(stub, args)
	}
	return shim.Success(nil)
}

func (s *SmartContract) registerSensor(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	sensorID := args[0]
	value := Value{SensorID: args[0], Temp: " ", Time: " "}
	valueAsBytes, _ := json.Marshal(value)
	stub.PutState(sensorID, valueAsBytes)
	return shim.Success(nil)
}

func (s *SmartContract) addTemp(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 3 {
		return shim.Error("invalid number of arguments")
	}
	sensorID := args[0]
	valueAsBytes, _ := stub.GetState(sensorID)
	value := Value{}
	json.Unmarshal(valueAsBytes, &value)
	fmt.Println(value)

	value.Temp = args[1]
	value.Time = args[2]
	fmt.Println(value)
	valueByBytes, _ := json.Marshal(value)
	stub.PutState(sensorID, valueByBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	sensorID := args[0]

	iterator, err := stub.GetHistoryForKey(sensorID)
	if err != nil {
		return shim.Error(err.Error())
	}

	defer iterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")
	bArrayMemberAlreadyWritten := false
	for iterator.HasNext() {
		queryResponse, err := iterator.Next()
		if err != nil {
			shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		if queryResponse.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(queryResponse.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(queryResponse.Timestamp.Seconds, int64(queryResponse.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(queryResponse.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("getHistory:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
