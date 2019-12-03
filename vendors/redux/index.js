
function createStore(reducer,preloadedState,enhancer){
    if(typeof enhancer === 'function'){
        return enhancer(createStore)(reducer,preloadedState)
    }


    if(typeof preloadedState === 'function'){
        enhancer = preloadedState
        return enhancer(createStore)(reducer)
    }
    
    
    let currentState = preloadedState
    let listeners = []

    function getState(){
        return {...currentState}
    }
    function dispatch(action){
        currentState =  reducer(currentState,action)
        listeners.forEach(listener=>listener())
        return action
    }
    function subscribe(listener){
        listeners.push(listener)
        return function(){
            let index = listeners.indexOf(index)
            listeners.splice(index,1)
        }
    }
    dispatch({
        type:'@@/init'
    })

    return {
        getState,
        dispatch,
        subscribe
    }
}


function combineReducers(reducers){
    let keys = Object.keys(reducers)
    return function(state,action){
        keys.forEach(key=>state[key] = reducers[key](state[key],action))
        return state
    }
}

function bindActionCreators(actionCreators, dispatch){
    if(typeof actionCreators === 'function'){
        return bindActionCreator(actionCreators, dispatch)
    }   
    if(typeof actionCreators === 'object'){
        let keys = Object.keys(actionCreators)
        let boundActionCreators = {};
        keys.forEach(key=>boundActionCreators[key]=bindActionCreator(actionCreators[key],dispatch))
        return boundActionCreators
    } 
}
const bindActionCreator = (actionCreator,dispatch)=>(...args)=>{
    dispatch(actionCreator(...args))
}
const applyMiddleware = (...middlewares)=>createStore=>(...args)=>{
    const store = createStore(...args)
    let dispatch = (...args)=>dispatch(...args)
    middlewares = middlewares.map(middleware=>middleware({getState:store.getState,dispatch}))
    dispatch = middlewares.reduce((a,b)=>(...args)=>a(b(...args)))(store.dispatch)
    return {
        ...store,
        dispatch
    }
}
export  {
    createStore,
    combineReducers,
    bindActionCreators,
    applyMiddleware,
}