
function createElement(type,props,...children){
    children = children ? [].concat.apply([], children) : []
    children = children.filter(item=>!!item);
    props = {
        ...props,
        children
    }
    return new Element(type,props)
}

class Element{
    constructor(type,props){
        this.type = type;
        this.props = props
    }
}

class Component{
    static isReactComponent = true
    constructor(props,context){
        this.props = props
        this.context = context
    }
    setState(partialState){
        this._currentDOMBuilder.update(null,partialState)
    }
}

function createRef(){
    return {current:null}
}

function forwardRef(componentFunc){
    return function(props){
        return componentFunc(props,props.ref)
    }
}

function createContext(defaultValue){
    let value = defaultValue
    function Provider(props){
        value = props.value || value
        return props.children[0]
    }
    function Consumer(){
        return value
    }
    return {
        Consumer,
        Provider
    }
}

export  {
    createElement,
    Element,
    Component,
    createRef,
    forwardRef,
    createContext
}