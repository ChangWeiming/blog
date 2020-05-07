import React, { Component } from 'react'
import {Button} from 'antd'
import Axios from 'axios'
import {ServerIP} from './Default'
import cookie from 'react-cookies'
import PreviewBlocks from './PreviewBlock'
export default class Manage extends Component {
    
    constructor(props){
        super(props)
        //0 false -1 waiting 1 ok
        this.state = {passages:[],isLogin:-1}
    }
    
    async getAllPassages(){
        return await Axios.get(`${ServerIP}/all-passages`)
    }

    async isAccessible(){
        return Axios.get(`${ServerIP}/writing`,{params:{
            auth: cookie.load("GAGA")
        }})
    }

    componentDidMount(){
        this.isAccessible().then(res => {
            if(res.data === 'OK!') {

                this.getAllPassages().then(val => {
                    let arr = []
                    let len = Object.keys(val.data).length
                    for(var i = 0;i < len; i++){
                        arr.push(val.data[i])
                    }
                    this.setState({isLogin:1,passages:arr})
                })
            }
            else this.setState({isLogin:0})

        })
    }

    render() {
        if(this.state.isLogin === 0){
            return (<h2>Permission denied</h2>)
        }
        else if(this.state === -1) return (<div></div>)
        else return (
            <div>
            <div style = {{textAlign:"center",marginTop:"5%",position:"relative"}}>
                <Button onClick = {()=>{
                    this.props.history.push('/writing')
                }}>写文章</Button>
                <br></br>
            </div>
            <PreviewBlocks passages = {this.state.passages}></PreviewBlocks>
            </div>
        )
    }
}
