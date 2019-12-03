import React from '../vendors/react'

let Context =  React.createContext(1)

class Component1 extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            num:1,
            ary:[1,2,3,4,5]
        }
    }
    componentDidMount(){
    }
    render() {
        return (
                <div>
                    Component1
                    <div>{this.state.num}</div>
                    {this.state.ary.map(item=><div>
                        {item}.
                        {this.state.ary.map(item=><span>{item}</span>)}
                    </div>)}
                    <Component2 num={this.state.num}/>
                </div>
   
        )
    }
}
class Component2 extends React.Component {
    constructor(props){
        super(props)
        this.state={num:1}
    }
    componentDidMount(){
        // setInterval(() => {
        //     this.setState({num:this.state.num+1})
        // }, 1000);
        setTimeout(() => {
            this.setState({num:this.state.num+1})
        }, 1000);
    }
    render() {
        return <Context.Provider value={this.state.num}>
                <Component3/>
            </Context.Provider>
         
    }
}
class Component3 extends React.Component {
    render() {
        return (
            <div>
                Component3
                <Component4/>
            </div>
        )
    }
}
class Component4 extends React.Component {
    static contextType = Context
    render() {
        console.log('this',this)
        return (
            <div>
                Component4
                <div>{this.context}</div>
            </div>
        )
    }
}

React.render(<Component1/>,document.getElementById('root'))
