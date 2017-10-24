import React from 'react';

class CustomizedTooltip extends React.Component {
    render() {
        const { payload, moods } = this.props;
        if (payload && payload.length > 0) {
            return (
                <div className="tooltip-inner">
                    {((new Date() - payload[0].payload.date) / 60000).toFixed(2)} minutes ago <br/>
                    Score: {moods[payload[0].value].name}
                </div>
            );
        }

        return null;
    }
}

export default CustomizedTooltip;