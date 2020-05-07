import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter as Router} from 'react-router-dom';

const Root = () =>{
    return (
    <div>
    <Router>
        <App></App>
    </Router>
    </div>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));