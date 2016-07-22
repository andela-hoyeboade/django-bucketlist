import React, { Component } from 'react';

export default class Main extends Component {
   constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
