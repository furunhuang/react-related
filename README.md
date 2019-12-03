# 简易react和相关库的实现

**不可作为源码参考**

项目用于个人学习，功能实现主要考虑对自身学习帮助，不是为了实现完整的react。部分功能不考虑实现或者实现原理不相同。


## 项目运行

```
npm install 

npm dev
```

## react实现简短说明

1. **webpack**引入**babel-loader**将jsx转换为js代码
2. 实现**createElement**，用来生成react元素
3. 根据react元素来产生**DOMBuilder**实例，负责DOM的实际渲染,挂载,diff,卸载


## 当前react功能
文件路径 **./vendors/react**

实现了主要核心功能，使用方法基本与react一致可以参照 **./test** 目录下文件

主要不同：

1. **setState**，不支持批量更新和回调。当前事件实现为直接绑定，未使用委托的方式，不推荐学习。正确实现应该是委托到doc上，在用户事件处理函数前后加上批量更新和回调相关逻辑。
2. 现支持的生命周期只有**constructor**，**componentDidMount** ，**componentWillUnmount** **render**。多组件嵌套下**componentWillUnmount**执行顺序和react相反
3. 不支持列表key的虚拟diff。目前实现为同层级类型diff，相同类型修改dom，不同类型直接替换


## 当前redux功能
文件路径 **./vendors/redux**

实现的api：
1.    createStore,
2.    combineReducers,
3.    bindActionCreators,
4.    applyMiddleware,


## 当前react-redux功能
文件路径 **./vendors/react-redux**

实现的api：
1.    Provider,
2.    connect,



## 当前react-router功能
文件路径 **./vendors/react-router**

组件功能都不完善，只支持hashRouter的显示控制

可用组件：
1. HashRouter
2. Route



