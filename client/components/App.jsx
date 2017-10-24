//imports
import React from 'react';
import {
    Modal,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../stylesheets/main.css';
import '../stylesheets/media-queries.css';

import Slider from './Slider';
import Comments from './Comments';
import Footer from './Footer';
import Clock from './Clock';

//utility variables    
import { visible, hidden } from './styles/styles';

const pathToImages = require.context('../images/', true);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //declaration of the state
            slide_moods: [
                { name: "Horrible", count: 0, value: 0 },
                { name: "Bad", count: 0, value: 1 },
                { name: "Good", count: 0, value: 2 },
                { name: "Great", count: 0, value: 3 },
                { name: "Awesome", count: 0, value: 4 }
            ],
            slides: [
                { pic_url: "./01.png" },
                { pic_url: "./02.png" },
                { pic_url: "./03.png" }
            ],
            comments: [],
            presentationVotes: [],
            isPresenter: false,
            playerStyle: null,
            commentsStyle: null,
            commentBoxStyle: null,
            rateBoxStyle: null
        }
        //bindings
        this.removeStyles = this.removeStyles.bind(this);
        this.togglePlayerComments = this.togglePlayerComments.bind(this);
        this.toggleCommentBox = this.toggleCommentBox.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.removeStyles);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.removeStyles);
    }

    removeStyles() {
        if (window.innerWidth > 767)
            this.setState({
                playerStyle: null,
                commentsStyle: null,
                commentBoxStyle: null,
                rateBoxStyle: null
            })
    }

    //functions for changing view on mobile screens
    togglePlayerComments() {
        this.setState(prevState => {
            if (prevState.commentsStyle === visible) {
                return {
                    commentsStyle: hidden,
                    playerStyle: visible
                }
            } else {
                return {
                    commentsStyle: visible,
                    playerStyle: hidden
                }
            }
        })
    }

    toggleCommentBox() {
        this.setState(prevState => {
            if (prevState.commentBoxStyle === visible) {
                return {
                    commentBoxStyle: hidden,
                    rateBoxStyle: visible
                }
            } else {
                return {
                    commentBoxStyle: visible,
                    rateBoxStyle: hidden
                }
            }
        })
    }

    login() {
        this.setState((prevState) => ({
            isPresenter: !prevState.isPresenter
        }));
    }

    //the render method
    render() {
        //we return JSX syntax. Plain Javascript code is between { }
        return (
            <div>
                <Row className="top-container">
                    <Col sm={12} className="loginBar">
                        <button className="btn btn-login" onClick={this.login}>{this.state.isPresenter ? 'Logout' : 'Login'}</button>
                    </Col>
                </Row>
                <Row className="top-container">
                    <Slider isPresenter={this.state.isPresenter}
                        slides={this.state.slides}
                        style={this.state.playerStyle}
                        onToggle={this.togglePlayerComments} />
                    <Comments isPresenter={this.state.isPresenter}
                        style={this.state.commentsStyle}
                        onToggle={this.togglePlayerComments}
                        comments={this.state.comments} />
                </Row>

                <Row>
                    <Footer isPresenter={this.state.isPresenter}
                        slide_moods={this.state.slide_moods}
                        commentBoxStyle={this.state.commentBoxStyle}
                        rateBoxStyle={this.state.rateBoxStyle}
                        onToggleCommentBox={this.toggleCommentBox}
                        presentationVotes={this.state.presentationVotes} />
                </Row>
            </div>
        );
    }
}

export default App;