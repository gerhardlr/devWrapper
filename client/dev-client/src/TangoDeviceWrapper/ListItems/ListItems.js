import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';

function ListItems(props){
    const list = props.list;
    const listItems = list.map((item, index) =>
        <li key ={index}>{item.text+" "+item.time.toLocaleTimeString()}</li>
     );
    return (<ol>{listItems}</ol>);
}

export default ListItems