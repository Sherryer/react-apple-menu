import React, {Component} from 'react';
import {createPortal} from 'react-dom';

export default class extends Component{
    constructor(z){
        super(z);
        if(this.props.portal && createPortal) {
            const doc = window.document;
            this.node = doc.createElement('div');
            doc.body.appendChild(this.node);
        }
    }

    componentWillUnmount() {
        window.document.body.removeChild(this.node);
    }
    render (){
        if(this.props.portal && createPortal) {
            return createPortal (
                this.props.children
                ,this.node
            )
        } else {
            return (
                this.props.children
            )
        }
    }
}