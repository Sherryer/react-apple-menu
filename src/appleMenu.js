import React, {Component} from 'react';

class AppleMenu extends Component {

    constructor(...props){
        super(...props);
        this.getDistance = this.getDistance.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.easeOut = this.easeOut.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.filterImg = this.filterImg.bind(this);
        this.inOut = true;
        this.moveFlag = true;
        this.mouseMoveBegin = false;
        this.Changes = []
    }



    mouseEnter (ev){
        this.mouseMoveBegin = true;
        this.inOut = true;
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let iMax = 200;
        for (let i = 0; i < aImg.length; i++) {
            let d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, iMax);
            let changeNum = ((iMax - d) / iMax) * this.props.size * this.props.zoom;
            this.Changes[i] = changeNum;

            let t = 0;
            let during = 15;
            let step = () => {
                let value = this.easeOut(t, this.props.size , changeNum , during);
                if(value - this.props.size  >= this.Changes[i]){
                    this.mouseMoveBegin = true;
                    return
                }
                aImg[i].style.width = value + "px";
                aImg[i].style.height = value + "px";
                t++;
                if (t <= during && this.inOut) {
                    requestAnimationFrame(step);
                }
            };
            step();
        }
    }

    mouseMove (ev) {
        // if(!this.state.moveFlag) return;
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let d = 0;
        let iMax = 200;

        for (let i = 0; i < aImg.length; i++) {
            d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, iMax);
            this.Changes[i] = ((iMax - d) / iMax) * this.props.size * this.props.zoom;
            if(this.mouseMoveBegin){
                aImg[i].style.width =  this.Changes[i] + this.props.size+'px';
                aImg[i].style.height = this.Changes[i] + this.props.size+'px';
            }

        }
    };

    mouseOut (){
        this.inOut = false;
        this.mouseMoveBegin = false;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        for (let i = 0; i < aImg.length; i++) {
            let t = 0;
            let during = 60;
            let step = () => {
                var value = this.easeOut(t, aImg[i].offsetWidth, this.props.size - aImg[i].offsetWidth, during);
                aImg[i].style.width = value + "px";
                aImg[i].style.height = value + "px";
                t++;
                if (t <= during && !this.inOut) {
                    requestAnimationFrame(step);
                }else{

                }
            };
            step();
        }

    }

    getDistance(img, target, oEvent) {
        return Math.abs(img.offsetLeft + target.offsetLeft - oEvent.clientX + img.offsetWidth / 2)
    }

    easeOut (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    filterImg (body,img) {
        let src = [];
        let imgs = React.Children.map(this.props.children, (child, index) => {
            if( child.type == "img" ){
                return (
                    <img style={img} {...child.props}/>
                )
            }
        });
        return imgs
    }

    render () {
        let body = {
            position: "absolute",
            bottom: 0,
            display: "flex",
            justifyContent:"center",
            width:"100%"
        };
        let img = {
            width: this.props.size+"px",
            height: this.props.size+"px",
            alignSelf: "flex-end"
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