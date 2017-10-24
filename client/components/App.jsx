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

const credentials = {
    publish_key: 'your pub keys here',
    subscribe_key: 'your sub keys here'
}
const mainChannel = 'realtime-app';

const number = ('' + Math.random() * 100000).split('.')[0];

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
            rateBoxStyle: null,
            index: 0,
            direction: null,
            showCallingModal: false,
            showConferenceModal: false
        }
        //bindings
        this.removeStyles = this.removeStyles.bind(this);
        this.togglePlayerComments = this.togglePlayerComments.bind(this);
        this.toggleCommentBox = this.toggleCommentBox.bind(this);
        this.login = this.login.bind(this);
        this.sendSlide = this.sendSlide.bind(this);
        this.receiveMessages = this.receiveMessages.bind(this);
        this.sendRate = this.sendRate.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.sendDeleteComment = this.sendDeleteComment.bind(this);
        this.callUser = this.callUser.bind(this);
        this.hangUp = this.hangUp.bind(this);
    }

    componentDidMount() {
        console.log(number);
        this.PubNub = PUBNUB.init({
            publish_key: credentials.publish_key,
            subscribe_key: credentials.subscribe_key
        });
        this.PubNub.subscribe({
            channel: mainChannel,
            message: this.receiveMessages
        });
        if (navigator.mediaDevices) {
            this.phone = PHONE({
                number: number,
                publish_key: credentials.publish_key,
                subscribe_key: credentials.subscribe_key
            });
            this.phone.camera.ready(video => {
                console.log('Camera Ready');
                this.localvideo = video;
            });
            this.phone.receive(session => {
                console.log('receiving call from:', session);
                session.connected(session => {
                    console.log('Session: CONNECTED');

                    session.video.className = 'you';
                    session.video.width = this.localvideo.width;
                    session.video.height = this.localvideo.height;
                    this.localvideo.className = 'me';

                    this.toggleModal('conference');
                    if (this.state.isPresenter) this.toggleModal('calling');

                    this.video.appendChild(this.localvideo);
                    this.video.appendChild(session.video);
                });
                session.ended(session => {
                    console.log('Session: ENDED');
                    this.toggleModal('conference');
                })
            });
        }
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

    sendMessage(message) {
        this.PubNub.publish({
            channel: mainChannel,
            message: message
        });
    }

    login() {
        this.setState((prevState) => ({
            isPresenter: !prevState.isPresenter
        }));
    }

    receiveMessages(message) {
        console.log('received:', message);
        switch (message.type) {
            case 'SLIDE':
                this.setState({
                    index: message.index,
                    direction: message.direction
                });
                break;
            case 'VOTE':
                this.setState(prevState => {
                    prevState.presentationVotes.push({
                        name: message.mood_name,
                        value: message.value,
                        date: new Date()
                    });
                    prevState.slide_moods[message.value].count++;
                    return {
                        presentationVotes: prevState.presentationVotes,
                        slide_moods: prevState.slide_moods
                    }
                });
                break;
            case 'COMMENT':
                this.setState((prevState) => {
                    prevState.comments.push({
                        text: message.comment,
                        user: message.user,
                        can_webrtc: message.can_webrtc
                    });
                    return {
                        comments: prevState.comments
                    }
                });
                break;
            case 'DELETE':
                this.setState(prevState => {
                    prevState.comments.splice(message.index, 1);
                    return {
                        comments: prevState.comments
                    }
                });
                break;
        }
    }

    sendSlide(index, direction) {
        this.sendMessage({
            type: 'SLIDE',
            index: index,
            direction: direction
        })
    }

    sendRate(mood_name, value) {
        this.sendMessage({
            type: 'VOTE',
            mood_name: mood_name,
            value: value
        })
    }

    sendComment(text, user, can_webrtc) {
        this.sendMessage({
            type: 'COMMENT',
            comment: text,
            user: number,
            can_webrtc: navigator.mediaDevices ? true : false
        })
    }

    sendDeleteComment(index) {
        this.sendMessage({
            type: 'DELETE',
            index: index
        });
    }

    toggleModal(modal) {
        switch (modal) {
            case 'calling':
                this.setState({ showCallingModal: !this.state.showCallingModal });
                break;
            case 'conference':
                this.setState({ showConferenceModal: !this.state.showConferenceModal });
                break;
        }
    }

    callUser(number) {
        console.log('calling ' + number + '...')
        this.toggleModal('calling');
        let session = this.phone.dial(number);
    }

    hangUp() {
        this.phone.hangup();
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
                        onToggle={this.togglePlayerComments}
                        onSlide={this.sendSlide}
                        index={this.state.index}
                        direction={this.state.direction} />
                    <Comments isPresenter={this.state.isPresenter}
                        style={this.state.commentsStyle}
                        onToggle={this.togglePlayerComments}
                        comments={this.state.comments}
                        onDeleteComment={this.sendDeleteComment}
                        onCall={this.callUser} />
                </Row>

                <Row>
                    <Footer isPresenter={this.state.isPresenter}
                        slide_moods={this.state.slide_moods}
                        commentBoxStyle={this.state.commentBoxStyle}
                        rateBoxStyle={this.state.rateBoxStyle}
                        onToggleCommentBox={this.toggleCommentBox}
                        presentationVotes={this.state.presentationVotes}
                        onRate={this.sendRate}
                        onAddComment={this.sendComment} />
                </Row>

                <Modal show={this.state.showCallingModal} onHide={() => this.toggleModal('calling')}>
                    <Modal.Header closeButton>
                        <Modal.Title><img src={pathToImages("./phone.svg", true)} className="shake" /> Outgoing Call</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="calling">Calling (User)...</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.toggleModal('calling')}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showConferenceModal} onHide={this.hangUp}>
                    <Modal.Header closeButton>
                        <Modal.Title><img className="phone_icon" src={pathToImages("./phone.svg", true)} /> Person to Person Call</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div ref={input => this.video = input}></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="span12" id="video-controls">
                            <Button onClick={this.hangUp}>Hang Up</Button>
                            <span id="time"><Clock /></span>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default App;