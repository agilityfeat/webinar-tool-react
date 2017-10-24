import React from 'react';

class Clock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            elapsed_time: 0
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
      }

    tick() {
        this.setState(prevState => ({
            elapsed_time: prevState.elapsed_time + 1
        }));
    }

    showTime() {
        let minutes, seconds;
        minutes = Math.floor(this.state.elapsed_time / 60);
        seconds = this.state.elapsed_time % 60;
        if (minutes.toString().length === 1) {
            minutes = "0" + minutes;
        }
        if (seconds.toString().length === 1) {
            seconds = "0" + seconds;
        }
        return("" + minutes + ":" + seconds);
    }

    render() {
        return (
            <span>{this.showTime()}</span>
        )
    }
}

export default Clock;