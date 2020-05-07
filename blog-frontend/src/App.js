import React from 'react'
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  BookOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import './index.css'
import {Default, ServerIP} from './Default'
import { Route, Link} from 'react-router-dom';
import Passages from './Passages'
import About from './About'
import Passage from './Passage'
import RootLogin from './RootLogin'
import { withRouter } from 'react-router-dom';
import Writing from './Writing'
import Manage from './Manage'
import Axios from 'axios';
import cookie from 'react-cookies'
import './App.css'
const { Sider } = Layout;

@withRouter
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            collapsed: false,
            selectedKeys: ["1"],
            isLogin: false,
        };
      this.onMenuSelect = this.onMenuSelect.bind(this)
      this.setState({selectedKeys: this.getURLToNums()})

      this.getInitialLoginState().then(res=>{
        if(res.data === 'OK!') this.setState({isLogin:true})
    }).finally(err=>{
        this.setState({selectedKeys:this.getURLToNums()})
    })


    }

    onMenuSelect(e){
        this.setState({selectedKeys:[e.key]});
    }

    getURLToNums(){
        let cur = this.props.location.pathname
        if(cur[1] === 'p') return ["2"]
        if(cur[1] === 'a') return ["3"]
        if(cur[1] === 'l') return ["4"]
        if(cur[1] === 'm' && this.state.isLogin === true) return ["5"]
        return ["1"]
    }

  onCollapse = collapsed => {
    this.setState({ collapsed });

  };
  updateLoginState = stateLogin => {
      this.setState({isLogin:stateLogin})
  }

  async getInitialLoginState() {
    return Axios.get(`${ServerIP}/writing`,{params:{auth:cookie.load("GAGA")}})
  }

  componentDidMount(){
    this.getInitialLoginState().then(res=>{
        if(res.data === 'OK!') this.setState({isLogin:true})
    })
  }

  test(){
    console.log("fdsl")
  }
  render() {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} breakpoint = "sm" className = "Sider">
                <div className="logo" />
                <Menu theme="dark" mode="inline" onSelect = {this.onMenuSelect} selectedKeys = {this.state.selectedKeys} className = "MenuSider">
                    
                    <Menu.Item key="1">
                        <Link to = '/'>
                            <FileOutlined />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>

                   <Menu.Item key="2">
                       <Link to = "/passage">
                            <BookOutlined />
                            <span>文章</span>
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="3">
                        <Link to = '/about'>
                            <MessageOutlined />
                            <span>关于</span>
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="4">
                        <Link to = '/login'>
                            <DesktopOutlined />
                            <span>登陆</span>
                        </Link>
                    </Menu.Item>
                    {this.state.isLogin === true &&  (
                        <Menu.Item key="5">
                        <Link to = '/manage'>
                            <DesktopOutlined />
                            <span>管理</span>
                        </Link>
                    </Menu.Item>
                    )}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Route path = '/passage' exact component = {Passages}/>
                <Route path = '/' exact component = {Default} />
                <Route path = '/about' exact component = {About}/>
                <Route path = '/passage/:id' exact component = {Passage}/>
                <Route 
                    path = '/login' exact 
                    render = {(props) => <RootLogin {...props} updateFather = {this.updateLoginState}/>}
                />
                <Route path = '/writing' exact component = {Writing}/>
                <Route path = '/manage' exact component = {Manage}/>
            </Layout>
        </Layout>
    );
  }
}
export default App;