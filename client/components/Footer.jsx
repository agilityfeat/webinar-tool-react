import React from 'react';

import {
    ComposedChart,
    Line,
    Area,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import {Col} from 'react-bootstrap';

import CustomizedDot from './CustomizedDot';
import CustomizedTooltip from './CustomizedTooltip';
import Clock from './Clock';

class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleRate = this.handleRate.bind(this);
        this.handleToggleCommentBox = this.handleToggleCommentBox.bind(this);
    }

    handleAddComment() {
        this.props.onAddComment(this.message.value.trim());
        this.message.value = '';
    }

    handleRate(mood_name, value) {
        console.log('Someone clicked ' + mood_name);
        alert('Thanks for your rating!');
        this.props.onRate(mood_name, value);
    }

    handleToggleCommentBox() {
        this.props.onToggleCommentBox();
    }

    render() {
        const { isPresenter, slide_moods, presentationVotes, commentBoxStyle, rateBoxStyle } = this.props;
        var footer;
        if (isPresenter) {
            const moodsFreq = slide_moods.map((mood, index) =>
                <div key={index} className="graphLabel">
                    <span className="name">{mood.name}</span>
                    <div className="barGraphBg">
                        <div className={'bar bar' + mood.name} style={{
                            width: 100 * mood.count / presentationVotes.length + '%'
                        }}></div>
                        <span className="mood_count">{(100 * mood.count / presentationVotes.length) ? ((100 * mood.count / presentationVotes.length).toFixed(2) + '%') : '0%'}</span>
                    </div>
                </div>
            );
            footer = (
                <div>
                    <Col sm={9} className="graphWrap">
                        <ResponsiveContainer className="chart" width="100%" height={155}>
                            <ComposedChart width={600} height={155} data={presentationVotes.slice()}>
                                <Tooltip content={<CustomizedTooltip moods={slide_moods} />} />
                                <Area type="monotone" dataKey="value" stroke="#3c5868" fill="#3c5868" />
                                <Line type="monotone" dataKey="value" stroke="#3c5868" dot={<CustomizedDot />} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col sm={3} className="colGraphWrap">
                        {moodsFreq.reverse()}
                    </Col>
                    <Col sm={1} className="col-sm-1 timeLapseWrap">
                        <span>Time Lapse</span>
                        <div className="timer" id="timerWrap">
                            <Clock />
                        </div>
                    </Col>
                </div>
            );
        } else {
            const listMoods = slide_moods.map((mood, index) =>
                <span key={index} className={"rateOption rate" + mood.name} onClick={(e) => this.handleRate(mood.name, mood.value)}>
                    <span className="inneCircle"></span>
                    <span className="label">{mood.name}</span>
                </span>
            );
            footer = (
                <div>
                    <Col sm={6}>
                        <div className="rateSlideWrap" style={rateBoxStyle}>
                            <div className="thanks_for_rating">Thanks for rating the presentation</div>
                            <span ref={(input) => this.rate = input} className="title pull-left">
                                Rate current slide:
                        </span>
                            <div className="rateOptionsWrap">
                                <div className="floatClear"></div>
                                {listMoods}
                            </div>
                            <div className="showCommentBox" onClick={this.handleToggleCommentBox}>
                                Add Comments
				        </div>
                        </div>
                    </Col>

                    <Col sm={6}>
                        <div className="commentSlideWrap" style={commentBoxStyle}>
                            <span>
                                You say:
					        </span>
                            <textarea ref={input => this.message = input} className="commentsHere" placeholder="Your comment"></textarea>
                            <button type="button" id="btn_send_message" className="btn btn-presentation" onClick={this.handleAddComment}>Submit</button>
                            <span className="hideCommentBox" onClick={this.handleToggleCommentBox}>Cancel</span>
                        </div>
                    </Col>
                </div>
            );
        }
        return (
            <footer>{footer}</footer>
        )
    }
}

export default Footer;