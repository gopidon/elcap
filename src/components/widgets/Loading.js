/**
 * Created by gopi on 1/5/18.
 */;
import React from 'react';
import ReactLoading from 'react-loading'

const Loading = ({type, color}) => {
    if(!type){
        type = "bubbles"
    }

    if(!color){
        color='#34236e'
    }

    return (
        <ReactLoading type={type} color={color}/>
    )
}

export default Loading;