import React, {useState, useEffect} from 'react'
import {Container, Card, Button} from 'react-bootstrap'
import getFromCookie from '../tokenHandler'
const axios = require('axios')

const UserOverview = () => {
    const [values, setValues] = useState({
        prosumerCount: 0,
        prevCountPro: 0,
        managerCount: 0,
        consumerCount: 0,
        prevCountCon: 0    // invariant var for consumerCount
    })

    useEffect(() => {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'POST',
            url: '/api/manager',
            data: {
            query: `query {
                managerData(input: {access: "${getToken.token}"}){
                  consumerCount
                  prosumerCount
                  managerCount
                }
              }`
            }
        })
        .then((response) => {
            var data = response.data.data.managerData
            setValues({
                prosumerCount: data.prosumerCount,
                consumerCount: data.consumerCount,
                managerCount: data.managerCount,
                prevCountCon: data.consumerCount,
                prevCountPro: data.prosumerCount
            })
        })
    },[])

    const handleConsumer = (e) => {
        const name = e.target.name
        let newVal
        console.log(name)
        switch(name) {
            case "increase":
                newVal = values.consumerCount + 1
                setValues({
                    prosumerCount: values.prosumerCount,
                    prevCountPro: values.prevCountPro,
                    managerCount: values.managerCount,
                    prevCountCon: values.consumerCount,
                    consumerCount: newVal
                })
                break;
            case "decrease":
                newVal = values.consumerCount - 1
                setValues({
                    prosumerCount: values.prosumerCount,
                    prevCountPro: values.prevCountPro,
                    managerCount: values.managerCount,
                    prevCountCon: values.consumerCount,
                    consumerCount: newVal
                })
                break;
            case "prosumer":
                newVal = values.prosumerCount + 1
                setValues({
                    managerCount: values.managerCount,
                    consumerCount: values.consumerCount,
                    prevCountCon: values.prevCountCon,
                    prevCountPro: values.prosumerCount,
                    prosumerCount: newVal
                })
                break;
            default:
                console.log('Could not handle change.')
        }
    }

    // update API everytime consumerCount changes
    useEffect( () => {
        const getToken = getFromCookie('accessToken')
        var query
        if (values.consumerCount > values.prevCountCon) {
            query = `mutation {
                addConsumer(input: {access:"${getToken.token}"})
                {
                  status
                  message
                }
              }`
        } else if(values.consumerCount < values.prevCountCon) {
            query = `mutation {
                removeConsumer(input: {access:"${getToken.token}"})
                {
                  status
                  message
                }
              }`
        } else if(values.prosumerCount > values.prevCountPro) {
            query = `mutation {
                addProsumer(input: {access:"${getToken.token}"})
                {
                  status
                  message
                }
              }`
        }
        // update only when invariant
        if (values.consumerCount !== values.prevCountCon || values.prosumerCount !== values.prevCountPro) {
            axios({
                method: 'POST',
                url: '/api/manager',
                data: {
                query: query
                }
            })
        }
    }, [values.consumerCount, values.prevCountCon, values.prosumerCount, values.prevCountPro])

    return(
        <Container fluid style={{marginBottom: 10}}>
            <Card>
                <Card.Header>
                    Number of users in the grid: {values.prosumerCount + values.consumerCount}
                </Card.Header>
                <Card.Body>
                    <p>Prosumers: {values.prosumerCount}</p>
                    <p>Consumers: {values.consumerCount}</p>
                    <Button variant="success" name="prosumer" onClick={handleConsumer} size="sm">
                        Add prosumer
                    </Button>
                    <Button variant="primary" name="increase" onClick={handleConsumer} size="sm" style={{marginLeft: 10}}>
                        Add consumer
                    </Button>
                    <Button variant="danger" name="decrease" onClick={handleConsumer} size="sm" style={{marginLeft: 10}}>
                        Remove consumer
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    )

}

export default UserOverview;