import React from 'react'
import { Layout } from 'antd';
import "./Default.css"
import axios from 'axios' 
import PreviewBlocks from './PreviewBlock';
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
// import { Router } from 'react-router';
const {Header} = Layout
const ServerIP = "http://47.95.209.207:8080/api"

class Default extends React.Component{

    constructor(props){
        super(props)
        this.state = {passages:[]}
    }

    async getDefualtPassage(){
        return await axios.get(`${ServerIP}/newest-passages`)
    }

    componentDidMount(){
        this.getDefualtPassage().then( val => {
            let arr = []
            let len = Object.keys(val.data).length
            for(var i = 0;i < len; i++){
                arr.push(val.data[i])
            }
            this.setState({passages:arr})
        })
    }

    render(){

        return (
            <div id = "wrapper">
            <Header className="site-layout-background" style={{ padding: 0}} >
                <img src="./gravatar.jpg" className = "main-gravatar" alt = "gravatar"/>
                <span style = {{display:"block",fontSize:"3vh"}}><b>CoolKid's Blog</b></span>
            </Header>
            <div id = "recent-post-header">
                Recent Posts
            </div>
            <PreviewBlocks passages = {this.state.passages}/>
            </div>
        );
    }
}

export { Default, ServerIP }