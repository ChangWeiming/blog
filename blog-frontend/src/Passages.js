import React, { Component } from 'react'
import PreviewBlocks from './PreviewBlock'
import Axios from 'axios'
import { Spin } from 'antd';
import {ServerIP} from './Default'
export default class Passages extends Component {

    constructor(props){
        super(props)
        this.state = {passages:[],loadingState:1,errMessage:""}
    }

    async getAllPassages(){
        return await Axios.get(`${ServerIP}/all-passages`)
    }
    componentDidMount(){
        this.getAllPassages().then(val => {
            let arr = []
            let len = Object.keys(val.data).length
            for(var i = 0;i < len; i++){
                arr.push(val.data[i])
            }
            this.setState({passages:arr,loadingState:0})
        }).catch(err => {
            this.setState({errMessage:"服务器果不其然又炸了",loadingState:3})
        })
    }

    render() {
        if(this.state.loadingState === 3) return (<div><h2 style = {{textAlign:"center"}}>{this.state.errMessage}</h2></div>)
        else return (
            <div>
                {
                this.state.loadingState ? 
                    (<div> <Spin size="large" tip="loading" id = "loading-tag"/></div>) : (<PreviewBlocks passages = {this.state.passages}/>)
                }
            </div>
        )
    }
}

