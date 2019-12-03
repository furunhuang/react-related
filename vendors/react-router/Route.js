import React from '../react';
import Context from './context';



export default class Route extends React.Component{
    static contextType = Context
    render(){
        let {context,props} = this
        let {pathname} = context.location
        let {path,component:Component } = props
        if((pathname === path )&& Component){
            return <Component {...context}/>
        }
        return 
    }
}