import React from '../vendors/react'
import {HashRouter,Route} from '../vendors/react-router'


class Main extends React.Component{
    render(){
        return <div>
            <div><a href="#/a">#a</a></div>
            <div><a href="#/b">#b</a></div>
            <div><a href="#/c">#c</a></div>
            <Route path="/" component={Title}/>
            <Route path="/a" component={ComponentA}/>
        </div>
    }
}
class Title extends React.Component{
    render(){
        return <h1>react-router</h1>
    }
}
class ComponentA extends React.Component{
    render(){
        return <p>{this.props.location.pathname}</p>
    }
}

React.render(<HashRouter><Main/></HashRouter>,document.getElementById('root'))
