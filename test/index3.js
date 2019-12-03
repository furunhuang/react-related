import React from '../vendors/react'
import {createStore,combineReducers,bindActionCreators,applyMiddleware} from '../vendors/redux'


const reducer1 = (state = {num:1}, action) => {
    switch (action.type) {
        case 'ACTION_INCREASE':
            return {
                ...state,
                num:state.num+1
            }
        case 'ACTION_REDUCE':
            return {
                ...state,
                num:state.num-1
            }
        default:
            return state
    }
}
const reducer2 = (state = {num:1}, action) => {
    switch (action.type) {
        case 'ACTION_INCREASE':
            return {
                ...state,
                num:state.num+2
            }
        case 'ACTION_REDUCE':
            return {
                ...state,
                num:state.num-2
            }
        default:
            return state
    }
}
const reducers = combineReducers({reducer1,reducer2})

const log = function({getState}){
    return function(next){
        return function(action){
            console.log('before1==>',getState())
            next(action)
            console.log('after1==>',getState())
        }
    }
}


const store =  createStore(reducers,{},applyMiddleware(log))
function actionIncrease(){
    console.log(arguments[0])
    return {type:'ACTION_INCREASE'}
}
function actionReduce(){
    return {type:'ACTION_REDUCE'}
}
const boundActionCreators = bindActionCreators({actionIncrease,actionReduce},store.dispatch)


class Component1 extends React.Component {
    constructor(props){
        super(props)
    
    }
    componentDidMount(){

    }
    componentWillUnmount(){
    }
    render() {
        return (
                <div>
                    Component1
                    <Component2/> 
                    <Component3/> 
                </div>
   
        )
    }
}
class Component2 extends React.Component {
    constructor(props){
        super(props)
        this.state = {num:1}
    }
    componentDidMount(){
        store.subscribe(()=>{
            this.setState({...store.getState().reducer1})
        })
    }
    componentWillUnmount(){
    }
    handleClick = ()=>{
        boundActionCreators.actionIncrease('handleClick')
    }
    render() {
        return   <div onClick={this.handleClick}>
                    Component2
                    <div>num:{this.state.num}</div>
                </div>
         
    }
}
class Component3 extends React.Component {
    constructor(props){
        super(props)
        this.state = {num:1}
    }
    componentDidMount(){
        store.subscribe(()=>{
            this.setState({...store.getState().reducer2})
        })
    }
    componentWillUnmount(){
    }
    render() {
        return (
            <div>
                Component3
                <div>num:{this.state.num}</div>
            </div>
        )
    }
}


React.render(<Component1/>,document.getElementById('root'))
