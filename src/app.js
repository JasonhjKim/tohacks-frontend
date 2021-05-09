import React, { Component } from 'react';
import { Container, Row, Col, Tabs, Tab} from 'react-bootstrap'
import styled from 'styled-components';
import BaseForm from './base-form'
import FinetuneForm from './finetune-form';

export default class App extends Component {
    state = {
        activeKey: "base"
    }

    handleOnKeySelect(e) {
        console.log(e)
        this.setState({
            activeKey: e
        })
    }

    render() {
        return (
            <Container>
                <Tabs
                    activeKey={this.state.activeKey}
                    onSelect={this.handleOnKeySelect.bind(this)}>
                    <Tab eventKey="base" title="Base Model Finder">
                        <Row>
                            <Col>
                                <BaseForm />
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="finetune" title="Model Fine Tuner">
                        <Row>
                            <Col>
                                <FinetuneForm/>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}