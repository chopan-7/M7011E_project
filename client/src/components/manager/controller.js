import React from 'react'
import Form from 'react-bootstrap/Form'

class Controller extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return(
            <div className={Controller}>
                <h3>Controller</h3>
                <div>
                <Form>
                    <Form.Group controlId="formBasicRange">
                        <Form.Label>Buffer ratio:</Form.Label>
                        <Form.Control type="range" />
                    </Form.Group>
                </Form>
                </div>
            </div>
        )
    }
}

export default Controller;