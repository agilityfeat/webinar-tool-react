import React from 'react';

import {hidden, visible} from './styles/styles';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteComments: false,
            showCallControls: false,
            showMainControls: true
        }

        this.toggleShowDeleteCmts = this.toggleShowDeleteCmts.bind(this);
        this.toggleCallControls = this.toggleCallControls.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleCall = this.handleCall.bind(this);
    }

    toggleShowDeleteCmts() {
        this.setState(prevState => ({
            showDeleteComments: !prevState.showDeleteComments,
            showMainControls: !prevState.showMainControls
        }));
    }

    toggleCallControls() {
        this.setState(prevState => ({
            showCallControls: !prevState.showCallControls,
            showMainControls: !prevState.showMainControls
        }))
    }

    handleCall(number){
        console.log('preparing call to ' + number);
        this.props.onCall(number);
    }

    handleToggle() {
        this.props.onToggle();
    }

    handleDeleteComment(index) {
        this.props.onDeleteComment(index); 
    }

    render() {
        const {showDeleteComments, showMainControls, showCallControls} = this.state;
        const comments = this.props.comments;
        const listComments = comments.map((comment, index) =>
            <div className="commentItem" key={index}>
                <span className="commentText">
                    {comment.text}
                </span>
                <span style={showDeleteComments ? visible : hidden} className="deleteBtn" onClick={e => this.handleDeleteComment(index)}><span className="lineDel"></span></span>
                {comment.can_webrtc &&
                    <span className="cameraBtn" style={showCallControls ? visible : hidden} onClick={e => this.handleCall(comment.user)}>
                        <span className="glyphicon glyphicon-facetime-video"></span>
                    </span>
                }
            </div>
        )
        return (
            <div className="col-sm-4 leftBorder">
                <div className="winWrap commentsWindowWrap" style={this.props.style}>
                    <div className="commentHeader">
                        <span className="leftText">Comments</span>
                        <div className="btnShow" onClick={this.handleToggle}>Current Slide</div>
                        {this.props.isPresenter &&
                            <div className="actionsWrap">
                                <span className="initialCall" style={showMainControls ? visible : hidden}>
                                    <span className="cameraCall" onClick={this.toggleCallControls}><span className="glyphicon glyphicon-facetime-video"></span></span>
                                    <span className="commentsCall" onClick={this.toggleShowDeleteCmts}>Edit</span>
                                </span>
                                <span className="doneBtn" onClick={this.toggleShowDeleteCmts} style={showDeleteComments ? visible : hidden}>Done</span>
                                <span className="doneBtn blue" onClick={this.toggleCallControls} style={showCallControls ? visible : hidden}>Done</span> 
                            </div>
                        }
                    </div>
                    <div className="commentsList">
                        {listComments}
                    </div>
                </div>
            </div>
        );
    }
}

export default Comments;