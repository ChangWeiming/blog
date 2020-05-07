import React, { Component } from 'react'
import Axios from 'axios'
import marked from 'marked'
import './passage.css'
import {ServerIP} from './Default'
export default class Passage extends Component {
    constructor(props){
        super(props)
        this.state = { head: '',content:''}
    }

    async getPassage(){
        console.log(this.props)
        return Axios.get(`${ServerIP}/passage`,{params:{"passage-id":this.props.match.params.id}})
    }

    componentDidMount(){
        this.getPassage().then(res =>{
            this.setState({
                head: res.data[0].title,
                content: marked(res.data[0].content),
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                head: "InternalServerError",
                content: "你看到这条消息的时候大概率是服务器挂了（（"
            })
        })
    }

    render() {
        return (
            <div id = "passage-container"> 
                <h1 id = "passage-header">{this.state.head}</h1>
                <div id = "passage-content" dangerouslySetInnerHTML = {{__html:this.state.content}}></div>
            </div>
        )
    }
}
