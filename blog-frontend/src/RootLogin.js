import React, { Component } from 'react'
import { Input, Button} from 'antd';
import './RootLogin.css'
import axios from 'axios';
import {ServerIP} from './Default'
export default class RootLogin extends Component {
    constructor(props){
        super(props)
        this.state = {
            usernameText: "",
            passwordText: "",
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onUsernameChange = this.onUsernameChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
    }

    onUsernameChange(e){
        this.setState({usernameText:e.target.value})
    }
    onPasswordChange(e){
        this.setState({passwordText:e.target.value})
    }
    onSubmit(e){
        const data = this.state
        this.setState({
            usernameText:"",
            passwordText:"",
        })
        axios.post(`${ServerIP}/login`,data).then(res => {
            if(res.data === "success"){
                alert("loginSuccess")
                this.props.updateFather(true)
                this.props.history.push('/manage')
            }
            else alert("failed")
        }).catch(err=>{
            alert("ServerErr")
        })
    }
    render() {
        return (
            <div id = "root-login">
                <Input size="large" placeholder="username" className = "input-box" value = {this.state.usernameText} onChange = {this.onUsernameChange}/>
                <Input.Password size="large" placeholder="large Password" className = "input-box" value = {this.state.passwordText} onChange = {this.onPasswordChange}/>
                <Button htmlType="submit" type="primary" id = "submit-button" onClick = {this.onSubmit}>
                    Submit
                </Button>
            </div>

        )
    }
}
