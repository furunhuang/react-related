import {Element} from './react.js'

function render(element,root){
    let rootBuilder = createDOMBuilder(element,root)
    rootBuilder.mountTag()
}
class DOMBuilder {
    constructor(element,root){
        this._element = element
        this._parentNode = root
    }
    mountTag(tag,afterTag){
        if(tag){
            this._parentNode.replaceChild(tag,this._tag)
        }else if(afterTag){
            this._parentNode.insertBefore(this._tag, afterTag);
        }else{
            this._parentNode.append(this._tag)
        }
    }
    unmountTag(loopUnmountComponent){
        if(!loopUnmountComponent){
            this._parentNode.removeChild(this._tag)
        }
        let childDOMBuilders = this._childDOMBuilders
        childDOMBuilders&&childDOMBuilders.forEach(builder=>builder.unmountTag(true))
        
    }
}

class TextDOMBuilder extends DOMBuilder{
    constructor(element,root){
        super(element,root)
        this._tag = document.createTextNode(element)
    }
    update(nextElement){
        if(typeof nextElement === 'object'){
            if(Array.isArray(nextElement)){
                nextElement = nextElement[0]
            }
            //创建新的生成器
            let builder = createDOMBuilder(nextElement,this._parentNode) 

            //把旧生成器替换为新的生成器
            let parentBuilder = this._parentBuilder
            let childDOMBuilders = parentBuilder._childDOMBuilders
            let index =  childDOMBuilders.indexOf(this)
            builder._parentBuilder = parentBuilder
            childDOMBuilders[index] = builder

            //卸载旧生成器挂载新生成器
            let afterDOM = getAfterDOM(childDOMBuilders[index+1])
            //新生成器挂载dom 旧生成器卸载dom
            builder.mountTag(void 0,afterDOM)
            this.unmountTag()
            return 

        }
        //元素不同生成新的 更新_tag和_element
        if(this._element !== nextElement){
            nextElement = nextElement || ''
            let newTag = document.createTextNode(nextElement)
            this.mountTag(newTag)
            this._tag = newTag
            this._element = nextElement
            return 

        }
    }
}
class NativeDOMBuilder extends DOMBuilder{
    constructor(element,root){
        super(element,root)
        let {type,props} = element
        let tag = this._tag = document.createElement(type)
        this.setAttributes(tag,props)
        this._childDOMBuilders = props.children.map((ele,index)=>{
            let childDOMBuilder = createDOMBuilder(ele,tag)
            childDOMBuilder._parentBuilder = this;
            childDOMBuilder.mountTag()
            return childDOMBuilder
        })
    }
    setAttributes(tag,props){
        for(let propName in props){
            if(propName === 'children'){
                continue;
            }else if(propName === 'className'){
                tag.setAttribute('class',props[propName])
            }else if(propName === 'style'){
                let styleObj = props[propName];
                let cssText = Object.keys(styleObj).map(attr=>{
                     return `${attr.replace(/([A-Z])/g,function(){return "-"+arguments[1].toLowerCase()})}:${styleObj[attr]}`;
                 }).join(';');
                 tag.style.cssText = cssText;
            }else if(/^on[A-Z]/.test(propName)){
                let eventName = propName.slice(2).toLowerCase();
                let handleEvent = props[propName]
                tag.addEventListener(eventName,handleEvent)
            }else if(propName === 'ref'){
                let refObj = props[propName]
                if(typeof refObj === 'object'){
                    refObj.current = tag
                }
            }else {
                tag.setAttribute(propName,props[propName])
            }
        }
    }
    update(nextElement){
        if(Array.isArray(nextElement)){
            nextElement = nextElement[0]
        }

        let oldElement = this._element
        let {type:oldType,props:oldProps} = oldElement
        let tag = this._tag

        if(nextElement && (oldType === nextElement.type)){
        let {props:newProps} = nextElement
            //替换当前属性 diff子元素
            updateDOMProperties(tag,newProps,oldProps);
            updateDOMChildren(this,newProps.children)
            //更新生成器的元素对象用于下次diff
            this._element = nextElement
        }else{

            //创建新的生成器
            let builder = createDOMBuilder(nextElement,this._parentNode) 
            
            //把旧生成器替换为新的生成器
            let parentBuilder = this._parentBuilder
            let childDOMBuilders = parentBuilder._childDOMBuilders
            let index =  childDOMBuilders.indexOf(this)
            builder._parentBuilder = parentBuilder
            childDOMBuilders[index] = builder

            //卸载旧生成器挂载新生成器
            let afterDOM = getAfterDOM(childDOMBuilders[index+1])
            //新生成器挂载dom 旧生成器卸载dom
            builder.mountTag(void 0,afterDOM)
            this.unmountTag()
        }

    }

}
function updateDOMProperties(node,newProps,oldProps){
    for(let propName in oldProps){
        if(/^on[A-Z]/.test(propName)){
            node.removeEventListener(propName,oldProps[propName]);
        }else{
            if(!oldProps[propName]){
                node.removeAttribute(propName.replace('className','class'));  
            }
        }
    }

    for(let propName in newProps){
        if(propName === 'children'){
            continue;
        }else if(propName === 'className'){
            node.setAttribute('class',newProps[propName])
        }else if(propName === 'style'){
            let styleObj = newProps[propName];
            let cssText = Object.keys(styleObj).map(attr=>{
                 return `${attr.replace(/([A-Z])/g,function(){return "-"+arguments[1].toLowerCase()})}:${styleObj[attr]}`;
             }).join(';');
             node.style.cssText = cssText;
        }else if(/^on[A-Z]/.test(propName)){
            let eventName = propName.slice(2).toLowerCase();
            let handleEvent = newProps[propName]
            node.addEventListener(eventName,handleEvent)
        }else if(propName === 'ref'){
            let refObj = newProps[propName]
            if(typeof refObj === 'object'){
                refObj.current = node
            }
        }else {
            node.setAttribute(propName,newProps[propName])
        }
    }
}
function updateDOMChildren(parentBuilder,elements){
    let builderChilds = parentBuilder._childDOMBuilders


    let len = Math.max(builderChilds.length,elements.length)
    for(let i = 0 ,j = 0; j<len ; i++,j++){
        let builder = builderChilds[i]
        let element = elements[j]
        if(builder && element){
            builder.update(element)
        }else if(builder && !element){
            builder.unmountTag()
            builderChilds.pop()
        }else if(!builder && element){
            let newBuilder = createDOMBuilder(element,parentBuilder._tag)
            newBuilder._parentBuilder = parentBuilder
            newBuilder.mountTag()
            builderChilds.push(newBuilder)
        }
    }
 
}
class ComponentDOMBuilder extends DOMBuilder{
    constructor(element,root){
        super(element,root)
        let {type:Component,props} = element
        let childrenElement = null
        let componentInstance = null

        if(Component.isReactComponent){
            let context = null
            if(typeof Component.contextType === 'object'){
                context = Component.contextType.Consumer()
            }
            componentInstance = new Component(props,context)
            //组件与生成器互相关联
            componentInstance._currentDOMBuilder = this
            this._componentInstance = componentInstance

            childrenElement = componentInstance.render()
        }else{
            childrenElement = Component(props)
        }
        //创建生成器的子生成器
        if(Array.isArray(childrenElement)){
            childrenElement = childrenElement[0]
        }
        let childDOMBuilder = createDOMBuilder(childrenElement,this._parentNode)
        childDOMBuilder._parentBuilder = this;
        this._childDOMBuilders = [childDOMBuilder]

        //一个组件生成两个生成器 一个父生成器储存组件实例，组件为处理前的element，子生成器储存render返回的element等相关数据
    }
    mountTag(...arg){
        this._childDOMBuilders.forEach(builder=>builder.mountTag(...arg))
        let componentInstance = this._componentInstance
        componentInstance&&componentInstance.componentDidMount&&componentInstance.componentDidMount()
    }
    unmountTag(){
        this._childDOMBuilders.forEach(builder=>builder.unmountTag())
        let componentInstance = this._componentInstance
        componentInstance&&componentInstance.componentWillUnmount&&componentInstance.componentWillUnmount()

    }
    update(nextElement,partialState){

        //自身相关联组件状态更新 render后由子生成器自行diff 类组件才能更新state
        if(partialState){
            let componentInstance = this._componentInstance; 
            Object.assign(componentInstance.state,partialState)
            //可添加生命周期是否更新
            let childrenElement = componentInstance.render()
            this._childDOMBuilders[0].update(childrenElement)
        }else{
        //处理组件render返回element  可能是函数组件

            if(Array.isArray(nextElement)){
                nextElement = nextElement[0]
            }
            let {type:OldComponent,props:oldProps} = this._element
            if(nextElement&&OldComponent === nextElement.type){
            let {type:NewComponent,props:newProps} = nextElement

                //相同组件  用旧组件render
                //是否是类组件
                if(OldComponent.isReactComponent){
                    //更新props context 更新旧的this.element render出结果交给子生成器处理
                    let componentInstance = this._componentInstance;
                    componentInstance.props = newProps

                    if(typeof OldComponent.contextType === 'object'){
                        let context = OldComponent.contextType.Consumer()
                        componentInstance.context = context
                    }

                    let childrenElement = componentInstance.render()
                    this._element = nextElement
                    this._childDOMBuilders[0].update(childrenElement)
                }else{
                    //函数传入newProps执行 
                    let childrenElement = OldComponent(newProps)
                    this._element = nextElement
                    this._childDOMBuilders[0].update(childrenElement)
                }

            }else{
                // 不同组件生成新的生成器替换掉旧的
                //创建新的生成器
                let builder = createDOMBuilder(nextElement,this._parentNode) 
                //把旧生成器替换为新的生成器
                let parentBuilder = this._parentBuilder
                let childDOMBuilders = parentBuilder._childDOMBuilders
                let index =  childDOMBuilders.indexOf(this)
                builder._parentBuilder = parentBuilder
                childDOMBuilders[index] = builder
                let afterDOM = getAfterDOM(childDOMBuilders[index+1])
                //新生成器挂载dom 旧生成器卸载dom
                builder.mountTag(void 0,afterDOM)
                this.unmountTag()
            }
        }
    }
}
function getAfterDOM(builder){
    if(!builder) return builder
    let tag = builder._tag
    return tag ? tag : getAfterDOM(builder.childDOMBuilders[0])
} ``

function createDOMBuilder(element="",root){
    if(typeof element === 'number' || typeof element === 'string'){
        return new TextDOMBuilder(element,root)
    }else if(element instanceof Element && typeof element.type === 'string'){
        return new NativeDOMBuilder(element,root)
    }else if(element instanceof Element && typeof element.type === 'function' ){
        return  new ComponentDOMBuilder(element,root)
    }
}


export  {
    render
}