import React from '../react';
import Context from './context';

export default class HashRouter extends React.Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            location:{pathname:window.location.hash.replace(/^#/,'') || '/'}
        }
    }
    componentDidMount(){
        window.addEventListener('hashchange',this.handleHashChange)
    }
    handleHashChange = ()=>{
        this.setState({
            location:{pathname:window.location.hash.replace(/^#/,'') || '/'}
        })
    }
    componentWillUnmount(){
        window.removeEventListener('hashchange',this.handleHashChange)
    }
    render(){
        return <Context.Provider value={this.state}>{this.props.children}</Context.Provider>
    }
}