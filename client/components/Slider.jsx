import React from 'react';
import { Carousel, Col } from 'react-bootstrap';

const pathToImages = require.context('../images/presentation/', true);

class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleChange(selectedIndex, e) {
        if(this.props.isPresenter) {
            this.props.onSlide(selectedIndex, e.direction);
        }
    }

    handleToggle() {
        this.props.onToggle();
    }

    render() {
        const slides = this.props.slides;

        const listSlides = slides.map((slide, index) =>
            <Carousel.Item key={index}>
                <img src={pathToImages(slide.pic_url, true)} />
            </Carousel.Item>
        );

        return (
            <Col sm={8}>
                <div className="playerWindowWrap" style={this.props.style}>
                    {/* PRESENTATION SLIDER */}
                    <div className="winWrap sliderWrap">
                        {/* SLIDER HEADER */}
                        <div className="slideHeader">
                            <span className="af-brand"></span>
                            <div className="btnShow" onClick={this.handleToggle}>View Comments</div>
                        </div>
                        {/* //SLIDER HEADER */}
                        {/* SLIDER */}
                        <Carousel activeIndex={this.props.index} direction={this.props.direction} onSelect={this.handleChange} controls={this.props.isPresenter}>
                            {listSlides}
                        </Carousel>
                        {/* SLIDER */}
                    </div>
                </div>
            </Col>
        );
    }
}

export default Slider;