import React, { Component } from 'react'  
import ReactDOM from 'react-dom'  
class HelloWorld extends Component {  
    render() {  
        return (  
            <div>  
                Hello, liangklfangl
            </div>  
        )  
    }  
}  
  
  
ReactDOM.render(  
    <HelloWorld />,  
    document.getElementById('content')  
);  