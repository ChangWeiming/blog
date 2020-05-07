import React, { Component } from 'react'
import { Layout } from 'antd';
import {
    CalendarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import "./PreviewBlock.css"
const {Content} = Layout
class PreviewBlock extends Component {
    render() {
        return (
            <div>
                <Content className = "content-preview-box">
                
                <Link to = {"/passage/"+this.props.content.passage_id}>
                    <h1 className = "header-preview">{this.props.content.title} </h1>
                    <div className = "content-preview"> {this.props.content.abstract}</div>
                </Link>
                    <div className = "more-data-preview"><CalendarOutlined />{this.props.content.publish_date}</div>
                
                </Content>
            </div>
        )
    }
}

class PreviewBlocks extends React.Component{
    render(){
        return(
        <div>
        {this.props.passages.map(passage => 
            <PreviewBlock key={passage.passage_id} content = {passage}/>)}
        </div>
        )
    }
}

export default PreviewBlocks