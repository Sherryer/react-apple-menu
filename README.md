# react-apple-menu

menu like apple dock

![image](https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/show-react-apple-menu.gif)

## Install
```sh
npm i react-apple-menu -S
```
## Usage

| props | description | defaultvalue | type |
| :---: | --- | --- | --- |
| zoom | pic zoom | 0.5 | number or string |
| size | pic size | 64 | number or string |
| stretch | stretch or not |  | boolean |
| left、top、right、bottom | menu position | bottom | boolean |


### Include the Component

```js
import AppleMenu from "react-apple-menu";
import React from 'react';

class Component extends React.Component {
    render() {
        let pd = {padding:"8px"}
        return (
            <AppleMenu>
                <img onClick = { () => ( alert ("hello") )}  src="https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/1.png"/>
                <img style = {pd} src = "https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/2.png"/>
                <img style = {pd} src = "https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/3.png"/>
                <img style = {pd} src = "https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/4.png"/>
                <img style = {pd} src = "https://raw.githubusercontent.com/Sherryer/Sherry-npm/master/static/images/5.png"/>
            </AppleMenu>
		)
	}
}
```
