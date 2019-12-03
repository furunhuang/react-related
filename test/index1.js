import React from '../vendors/react'


// let ele = <div className="div" onClick={fn} >
//     <div style={{color:'red'}}>123</div>
//     <div style={{color:'aqua'}}>456</div>
// </div>
// React.render(ele,document.getElementById('root'))




 class Main extends React.Component{
    constructor(props){
        super(props)
        this.divRef = React.createRef();
        this.state = {num1:1,num2:2}
        console.log('Main constructor')
    }
    componentDidMount() {
        console.log('Main componentDidMount')
        // setTimeout(this.handleClick,1000)
    }
    componentWillUnmount() {
        console.log('Main componentWillUnmount')
    }
    handleClick = (e)=>{
        this.setState({
            num1:this.state.num1+1
        })
    }
    render(){
        console.log('Main render')
        return (
            <div className={"div"+this.state.num1} id={"div"+this.state.num1} ref={this.divRef} onClick={this.handleClick} > 
                {
                    // this.state.num1%2 ? <Title title={'myReact'+this.state.num1} /> : <Todo txt={'myReact'+this.state.num1}/>
                   <Title title={'myReact'+this.state.num1} /> 
                }
                <div style={{color:'aqua'}}>{this.state.num1%2 ? '---------------' : '+++++++++++++++'}</div>
                <div style={{color:this.state.num1%2 ? 'red' : 'aqua'}}>{this.state.num1}</div>
                {
                    this.state.num1%2 ? <div style={{color:this.state.num1%2 ? 'red' : 'aqua'}}>{'偶数'}</div> : <Todo txt='奇数'/>
                }
                <div style={{color:'aqua'}}>---------------</div>
            </div>
        )
    }
 }
class Title extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            time:new Date().toString()
        }
        this.ref = React.createRef();
        console.log('Title constructor')
    }
    componentDidMount() {
        console.log('Title componentDidMount')
        setInterval(() => {
            this.setState({
                time:new Date().toString()
            })
        }, 1000);
    }

    render(){
        console.log('Title render')
        return <h1 style={{fontSize:'30px'}} ref={this.ref}>
            {this.props.title}
            <div>时间:{this.state.time}</div>
        </h1>
    }
}

let Todo = function(props){
    console.log('Todo render')
    return <div>{props.txt}</div>
}

React.render(<Main />,document.getElementById('root'))