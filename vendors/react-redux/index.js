import React from '../react'
import {bindActionCreators} from '../redux'
let context =  React.createContext()
function Provider(props){
    return <context.Provider value={props.store}>{props.children}</context.Provider>
}
const connect = (mapStateToProps,mapDispatchToProps)=>(Component)=>{
    mapStateToProps = mapStateToProps || (state=>state)

    return class extends React.Component{
        static contextType = context
        constructor(props,context){
            super(props,context)
            this.state = mapStateToProps(context.getState()) 
        }
        componentDidMount(){
            this.unsubcribe = this.context.subscribe(()=>{
                this.setState(mapStateToProps(this.context.getState()));
            });
        }
        componentWillUnmount(){
          this.unsubcribe();
        }
        render(){
            let actions = {}
            let dispatch = this.context.dispatch
            if(typeof mapDispatchToProps === 'function'){
                actions = mapDispatchToProps(dispatch)
            }else{
                actions = bindActionCreators(mapDispatchToProps,dispatch)
            }
            return <Component {...this.props} {...this.state} {...actions}/>
        }
    }
}



export  {
    Provider,
    connect,
}