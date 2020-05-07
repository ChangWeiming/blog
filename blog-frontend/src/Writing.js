import React, { Component } from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import { Spin,Input,Button } from 'antd';
import "./Writing.css"
import {ServerIP} from './Default'
const {TextArea} = Input


export default class Writing extends Component {
   
    async isAccessible(){
        return axios.get(`${ServerIP}/writing`,{params:{
            auth: cookie.load("GAGA")
        }})
    }

    constructor(props){
        super(props)
        this.state = {ok : 0,text:"",title:"",abstract:""}
        this.onChangeTextArea = this.onChangeTextArea.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    submitPassage() {
        let myDate = new Date()
        axios.post(`${ServerIP}/post-passage`,{
            SubDate: myDate.toLocaleDateString(),
            Title: this.state.title,
            Abstract: this.state.abstract,
            Content: this.state.text,
            CookieVal: cookie.load("GAGA"),
        }).then(res => {
            alert("Success!")
        }).catch(err =>{
            console.log(err)
            alert("failed")
        })
    }

    onSubmit(){

        if(this.state.title === '' || this.state.text === '' || this.state.abstract === '') {
            alert("全填！")
            return
        }
        this.submitPassage()
    }

    onChangeTextArea(e){
        this.setState({
            text:e.target.value
        })
    }

    onUpdate() {
        if(this.state.title === '' || this.state.text === '' || this.state.abstract === '') {
            alert("全填！")
            return
        }
        let myDate = new Date()
        axios.post(`${ServerIP}/update-passage`,
        {
                SubDate: myDate.toLocaleDateString(),
                Title: this.state.title,
                Abstract: this.state.abstract,
                Content: this.state.text,
                PassageID: this.props.passage_id,
                CookieVal: cookie.load("GAGA"),
        }).then(res => {
            alert("update success!")
        })
    }

    onDelete() {
        axios.post(`${ServerIP}/delete-passage`,{
            PassageID:this.props.passage_id
        }).then(res => {
            alert("delete success!")
        })
    }


    componentDidMount(){
        this.isAccessible().then(res => {
            console.log(res)
            if (res.data === "OK!"){
                this.setState({ok:1})
            } else {
                this.setState({ok:2})
            }
        }).catch(err => {
            this.setState({ok:2})
        })
    }

    render() {
        if (this.state.ok === 2) {
            return (<div style = {{fontSize:"3rem",fontWeight:600}}>You have no permission to access this</div>)
        } else if (this.state.ok === 1){
            return (
            <div style = {{float:"right"}}>
                <Input placeholder = "title" id = "title" 
                    value = {this.state.title}
                    onChange = {(e)=>{this.setState({title:e.target.value})}}></Input>
                <Input placeholder = "abstract" id = "abstract" 
                    value = {this.state.abstract}
                    onChange = {(e) => {this.setState({abstract:e.target.value})}} ></Input>
                <TextArea
                    value = {this.state.text}
                    autoSize = {{minRows:25}}
                    style = {{position : "relative",left: "8%",top:"30px",width:"84%",display:"block"}}
                    onChange = {this.onChangeTextArea}/>
                <Button htmlType="submit" 
                    type="primary" 
                    onClick = {this.onSubmit}
                    id = "passage-submit"> Submit</Button>
            </div>)
        } else {
            return (<div> <Spin size="large" tip="loading" id = "loading-tag"/></div>)
        }
    }
}
