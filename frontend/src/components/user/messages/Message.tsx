
import { useLocation } from 'react-router-dom';
import './Message.css'
import {format} from 'timeago.js'


const Message = ({message,own,user,vendor}) => {

    const location = useLocation();
    let isuser;
    if(location.pathname === '/vendor/chat/'){
        isuser = false;
    }else if(location.pathname === '/chat'){
        isuser = true;
    }

    return (
        <div className={own ? "message own" : "message"}>
        <div className="messageTop">
        <img
        className="messageImg"
        // src={isuser ? user?.imageUrl : vendor.logoUrl}
        alt="image"
        />
        <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
        );
}

export default Message