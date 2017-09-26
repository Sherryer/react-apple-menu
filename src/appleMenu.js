import React, {Component} from 'react';

class AppleMenu extends Component {

    constructor(...props){
        super(...props);
        if( this.props.left || this.props.right ) {
            this.getDistance = this.getDistanceRow.bind(this);
        } else {
            this.getDistance = this.getDistanceColumn.bind(this);
        }
        this.mouseEnter = this.mouseEnter.bind(this);
        this.easeOut = this.easeOut.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.filterImg = this.filterImg.bind(this);
        this.inOut = true;
        this.mouseMoveBegin = false;
        this.Changes = [];
        this.size = Math.abs((this.props.size)) || 64;
        this.zoom = Math.abs(Number(this.props.zoom)) || 0.5;
        this.iMax = Math.floor(this.size * 3.125);
        this.maxSize = this.size * this.zoom + this.size;
    }

    componentWillReceiveProps (nextProps){
        this.size = Math.abs((nextProps.size)) || 64;
        this.zoom = Math.abs(Number(nextProps.zoom)) || 0.5;
        this.iMax = Math.floor(this.size * 3.125);
        this.maxSize = this.size * this.zoom + this.size;
    }

    mouseEnter (ev) {
        this.mouseMoveBegin = false;
        this.inOut = true;
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let length = aImg.length;
        let count = 1;

        for (let i = 0; i < length; i++) {
            let d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, this.iMax);
            let changeNum = ((this.iMax - d) / this.iMax) * this.size * this.zoom;

            this.Changes[i] = changeNum;

            let t = 0;
            let during = 15;
            let step = () => {

                let value = this.easeOut(t, this.size , this.Changes[i] , during);
                if(value - this.size > changeNum){
                    this.mouseMoveBegin = true;
                    return
                }
                aImg[i].style.width = value + "px";
                aImg[i].style.height = value + "px";
                t++;
                if (t <= during && this.inOut && !this.mouseMoveBegin && changeNum) {
                    requestAnimationFrame(step);
                } else {
                    if(++count == length){
                        this.mouseMoveBegin = true;
                    }
                }
            };
            step();
        }

    }

    mouseMove (ev) {
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let d = 0;

        for (let i = 0; i < aImg.length; i++) {
            d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, this.iMax);
            this.Changes[i] = ((this.iMax - d) / this.iMax) * this.size * this.zoom;
            if( this.mouseMoveBegin ) {
                aImg[i].style.width =  this.Changes[i] + this.size+'px';
                aImg[i].style.height = this.Changes[i] + this.size+'px';
            }

        }
    };

    mouseOut () {
        this.inOut = false;
        this.mouseMoveBegin = false;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        for (let i = 0; i < aImg.length; i++) {
            let t = 0;
            let during = 15;
            let step = () => {
                var value = this.easeOut(t, aImg[i].width, this.size - aImg[i].width, during);
                aImg[i].style.width = value + "px";
                aImg[i].style.height = value + "px";
                t++;
                if (t <= during && !this.inOut) {
                    requestAnimationFrame(step);
                } else {

                }
            };
            step();
        }

    }

    getDistanceColumn (img, target, oEvent) {
        return Math.abs(img.offsetLeft + target.offsetLeft - oEvent.clientX + img.offsetWidth / 2)
    }

    getDistanceRow (img, target, oEvent) {
        return Math.abs(img.offsetTop + target.offsetTop - oEvent.clientY + img.offsetHeight / 2)
    }

    easeOut (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    filterImg (body,img) {
        let src = [];
        let imgs = React.Children.map(this.props.children, (child, index) => {
            if( child.type == "img" ){
                let {
                    style,
                    ...others
                } = child.props;
                Object.defineProperties(img, Object.getOwnPropertyDescriptors(style));
                this.imgPadding = img.padding;
                return (
                    <img style={img} {...others}/>
                )
            }
        });
        return imgs
    }

    render () {
        let position = "bottom";
        let order = "flex-end";
        let flexDirection = "row";
        let width = "100%";
        let height;
        let justifyContent = "center";
        if (this.props.top) {
            position = "top";
            order = "flex-start";
            flexDirection = "row";
            let width = "100%"
        } else if (this.props.left) {
            position = "left";
            order = "flex-start";
            flexDirection = "column";
            width = this.maxSize + 10 + "px";
            height = "100%"
        } else if (this.props.right) {
            position = "right";
            order = "flex-end";
            flexDirection = "column";
            width = this.maxSize + 10 + "px";
            height = "100%"
        }


        if ( this.props.stretch ) {
            justifyContent = "space-around"
        }

        let body = {
            position: "absolute",
            display: "flex",
            justifyContent: justifyContent,
            width: width,
            flexDirection: flexDirection,
            height: height
        };

        body[position] = 0;

        let img = {
            width: this.size+"px",
            height: this.size+"px",
            alignSelf: order
        };

        return (
            <div ref="target" onMouseEnter={this.mouseEnter} onMouseMove={this.mouseMove} onMouseLeave={this.mouseOut}  style={body}>
                {this.filterImg(body, img)}
            </div>
        )
    }
}

AppleMenu.defaultProps = {
    size: 64,
    zoom: 0.5
};

export default AppleMenu