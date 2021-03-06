import React, {Component} from 'react';
import Style from '../css/menu.css'
import Portal from './portal'


class AppleMenu extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            extend: [],
            extendImg: [],
        };
        if (this.props.left || this.props.right) {
            this.getDistance = this.getDistanceRow.bind(this);
        } else {
            this.getDistance = this.getDistanceColumn.bind(this);
        }
        this.mouseEnter = this.mouseEnter.bind(this);
        this.easeOut = this.easeOut.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.filterImg = this.filterImg.bind(this);
        this.extendImg = this.extendImg.bind(this);
        this.updateExtandImg = this.updateExtandImg.bind(this);
        this.imgs = [];
        this.imgPadding = 0;
        this.imgsLength = 0;
        this.inOut = true;
        this.mouseMoveBegin = false;
        this.filterImgFlag = true;
        this.addFlag = false;
        this.Changes = [];
        this.size = Math.abs((this.props.size)) || 64;
        this.zoom = Math.abs(Number(this.props.zoom)) || 0.5;
        this.iMax = Math.floor(this.size * 3.125);
        this.maxSize = this.size * this.zoom + this.size;
    }

    componentWillReceiveProps(nextProps) {
        this.size = Math.abs((nextProps.size)) || 64;
        this.zoom = Math.abs(Number(nextProps.zoom)) || 0.5;
        this.iMax = Math.floor(this.size * 3.125);
        this.maxSize = this.size * this.zoom + this.size;
        this.filterImgFlag = true;
        setTimeout(this.updateExtandImg, 0)
    }


    componentDidUpdate(props, state){
        if (this.addFlag) {
            this.addFlag = false;
            let imgs = this.refs.target.querySelectorAll('img');
            let lastImg = imgs[imgs.length - 1];
            let lastImgState = this.state.extendImg[this.state.extendImg.length -1 ];
            setTimeout(function(){
                lastImg.style.transition = 'opacity ease 0.2s';
                lastImg.style.opacity = 1;
                lastImgState.props.className = lastImgState.props.className.replace(Style.opacity, '');
            },16);
            this.mouseMove()
        }
    }

    mouseEnter(ev) {
        this.mouseMoveBegin = false;
        this.inOut = true;
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let count = 1;
        let length = this.imgsLength + this.state.extend.length;

        for (let i = 0; i < length; i++) {
            let d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, this.iMax);
            let changeNum = ((this.iMax - d) / this.iMax) * this.size * this.zoom;

            this.Changes[i] = changeNum;

            let t = 0;
            let during = 15;
            let step = () => {
                let value = this.easeOut(t, this.size, this.Changes[i], during);
                if (value - this.size > changeNum) {
                    this.mouseMoveBegin = true;
                    return
                }
                aImg[i].style.width = value + "px";
                aImg[i].style.height = value + "px";
                t++;
                if (t <= during && this.inOut && !this.mouseMoveBegin && changeNum) {
                    requestAnimationFrame(step);
                } else {
                    if (++count == length) {
                        this.mouseMoveBegin = true;
                    }
                }
            };
            step();
        }
    }

    mouseMove(ev) {
        let oEvent = ev || event;
        let target = this.refs.target;
        let aImg = target.getElementsByTagName('img');
        let d = 0;

        for (let i = 0; i < aImg.length; i++) {
            d = this.getDistance(aImg[i], target, oEvent);
            d = Math.min(d, this.iMax);
            this.Changes[i] = ((this.iMax - d) / this.iMax) * this.size * this.zoom;
            if (this.mouseMoveBegin) {
                aImg[i].style.width = this.Changes[i] + this.size + 'px';
                aImg[i].style.height = this.Changes[i] + this.size + 'px';
            }

        }
    };

    mouseOut() {
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
                }
            };
            step();
        }

    }

    filterImg(img) {
        let src = [];
        let extendImg = [];
        let imgs = React.Children.map(this.props.children, (child, index) => {
            if (child.type == "img") {
                let {
                    style,
                    ...others,
                } = child.props;
                if(style) {
                    Object.defineProperties(img, Object.getOwnPropertyDescriptors(style));
                }
                this.imgPadding = img.padding;
                return (
                    <img style={img} {...others}/>
                )
            }
        })||[];
        this.imgs = imgs;
        this.imgsLength = imgs.length ;
        return imgs;
    }

    extendImg(e) {
        this.addFlag = false;
        this.filterImgFlag = false;
        if (e.target.tagName === "IMG") {
            let extend = this.state.extend;
            let target = e.target;
            let index = Array.from(target.parentNode.querySelectorAll("img")).indexOf(target);

            if (index >= this.imgsLength) {
                return
                // 点击扩展栏情况 暂不处理
                // 判断是否需要重新渲染组件
                if (index - this.imgsLength + 1 === extend.length) {
                    return
                }
                extend.push(extend.splice(index - this.imgsLength, 1)[0])
            } else {
                // 点击非扩展栏情况
                // 判断是否需要重新渲染组件
                if (index == extend[extend.length - 1]) {
                    return
                }

                // 点击的图片 与 扩展栏中图片重复
                if (extend.indexOf(index) != -1) {
                    extend.splice(extend.indexOf(index), 1)
                } else {
                    if (extend.length <3 ) {
                        this.addFlag = true
                    }
                }
                // 扩展栏最大长度为 3
                if (extend.length >= 3) {
                    extend.shift()
                }
                extend.push(index);
            }
            this.updateExtandImg()
        }
    }

    updateExtandImg() {
        let updateImg = this.state.extend.map((value) => this.imgs[value]);
        if (this.addFlag) {
            let lastImg = updateImg[updateImg.length - 1];
            lastImg.props.className += ` ${Style.opacity}`;
        }
        this.setState({extendImg: updateImg})
    }


    getDistanceColumn(img, target, oEvent) {
        return Math.abs(img.offsetLeft + target.offsetLeft - oEvent.clientX + img.offsetWidth / 2)
    }

    getDistanceRow(img, target, oEvent) {
        return Math.abs(img.offsetTop + target.offsetTop - oEvent.clientY + img.offsetHeight / 2)
    }

    easeOut(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    render() {
        // 默认 menu 在底部样式
        let position = "bottom";
        let order = "flex-end";
        let flexDirection = "row";
        let width = "100%";
        let height;
        let justifyContent = "center";

        //根据 menu 不同位置调整样式
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

        if (this.props.stretch) {
            justifyContent = "space-around"
        }

        let body = {
            position: "absolute",
            display: "flex",
            justifyContent: justifyContent,
            width: width,
            flexDirection: flexDirection,
            height: height,
        };

        body[position] = 0;

        let img = {
            width: this.size + "px",
            height: this.size + "px",
            alignSelf: order
        };


        return (
            <Portal portal={this.props.portal}>
                <div className={Style.content} ref="target" onClick={this.props.dock&&this.extendImg} onMouseEnter={this.mouseEnter} onMouseMove={this.mouseMove} onMouseLeave={this.mouseOut}
                     style={body}>
                    {this.filterImgFlag ? this.filterImg(img) : this.imgs}
                    {this.state.extend.length != 0 &&
                    <Line style={{alignSelf: order, height: this.size, width: "1px", margin: this.imgPadding}}/>}
                    {this.state.extendImg}
                </div>
            </Portal>
        )
    }
}

class Line extends Component {
    render() {
        let style = {
            "background": "#e2e2e2"
        };
        style = this.props.style?Object.defineProperties(style, Object.getOwnPropertyDescriptors(this.props.style)) : style;
        return (
            <div style={style}></div>
        )
    }
}

AppleMenu.defaultProps = {
    size: 64,
    zoom: 0.5,
    portal: true
};

export default AppleMenu