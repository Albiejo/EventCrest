
import './Messenger.css';
import Conversation from '../../../Components/user/conversations/Conversation';
import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io} from 'socket.io-client'
import Message from '../../../Components/user/messages/Message';







const Messenger = () => {

    const user = useSelector((state: UserRootState) => state.user.userdata);

    const [conversation , setconversation] = useState([]);
    const [currentchat , setcurrentchat]  = useState(null);
    const [messages , setmessages] = useState([]);
    const [arrivalMessage , setArrivalMessage] = useState(null)
    const [newMessage, setnewMessage] = useState("");
    const [activeUsers, setActiveUsers] = useState([]);



    const scrollRef = useRef()
    const socket = useRef(io("ws://localhost:8900")); 
    const [typing , setTyping] = useState(false);


    const sendHeartbeat = () => {
        socket.current.emit("heartbeat");
    };

    setInterval(sendHeartbeat, 60000);



    useEffect(()=>{
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage" , (data)=>{
            setArrivalMessage({
                sender : data.senderId , 
                text : data.text,
                createdAt : Date.now()
            });
        })

        socket.current.on("typingsent" , (senderId)=>{
            setTyping(true);
            console.log("vendor typing");
            
        })

        socket.current.on("stopTypingsent" , (senderId)=>{                 
            setTyping(false);
            console.log("vendor stopped typing")
        })



    },[])



    useEffect(()=>{
        socket.current.emit("adduser" , user?._id);
        socket.current.on("getUsers" , (users)=>{
            console.log(users)
        })
    },[user])


    useEffect(()=>{
        arrivalMessage && currentchat?.members.includes(arrivalMessage.sender) &&
        setmessages((prev)=>[...prev , arrivalMessage])  
    },[arrivalMessage , currentchat])




    //getting conversations
    useEffect(()=>{
        const getconversation = async()=>{  
            try {
                const res = await axiosInstanceChat.get(`/?userId=${user?._id}`)
                setconversation(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getconversation();

    } , [user?._id])





    //gettin messages
    useEffect(()=>{
        const getmessages = async()=>{
            try {
                const res = await axiosInstanceMsg.get(`/?conversationId=${currentchat?._id}`)
                setmessages(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getmessages();
    },[currentchat])
    


    const receiverId = currentchat?.members.find((member)=>member !==user?._id)


     const handleSubmit=async(e)=>{
        e.preventDefault();
        sendHeartbeat();
        const message = {
            senderId: user?._id,
            text:newMessage,
            conversationId: currentchat?._id
        };
        socket.current.emit("sendMessage" , {
            senderId : user?._id,
            receiverId,
            text:newMessage
        })


                axiosInstanceMsg.post('/' , message).then((res)=>{
                setmessages([...messages , res.data]);
                setnewMessage("")
            }).catch ((error)=>{
                console.log(error)
            })
          
         

     };


     //scrolling to bottom when new msg arrives
     useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"})
     },[messages])



        const handleTyping = () => {
            socket.current.emit('typing', { receiverId: receiverId });
        };
  
        const handleStopTyping = () => {
            socket.current.emit('stopTyping', { receiverId: receiverId });
        };

        const handleInputChange = (e) => {
            setnewMessage(e.target.value);
            handleTyping();
           };
           
           
           useEffect(() => {
            socket.current.on("activeStatus", (users) => {
                setActiveUsers(users);
            });
        }, []);

        


  return (
   <>
   <div className='navbar'>

   </div>
   
   <div className="messenger">
    
    <div className="chatmenu w-50">
        <div className="chatmenuWrapper" >

           <input placeholder='Search for friends' className='chatmenuInput' />
           {conversation.map((c) => (
                <div onClick={()=> setcurrentchat(c)}>
                <Conversation  conversation={c} currentUser={user} active={activeUsers.some(u => u.userId === receiverId && u.active)}/>
                </div>
            ))}
        </div>
    </div>

    <div className="chatbox">
        <div className="chatboxWrapper">
            {
                currentchat ?
                (
                <>
                <div className="chatboxTop">
             
                    {messages.map((m)=>(
                        <div ref={scrollRef}>
                            <Message message={m} own={m.senderId === user?._id} user={user}/>
                        </div>
                    ))}
                     {typing && (
                     <div className='userTyping'>Typing...</div>
                    )}
                </div>
            <div className="chatboxBottom">
                <textarea className='chatMessageInput' placeholder='write something..' onChange={handleInputChange} value={newMessage}  onBlur={handleStopTyping} ></textarea>
               
                <button className='chatSubmitButton' onClick={handleSubmit}>send</button>
            </div>
                </> ):( <>
                <span className='noConversationtext'>open a conversation to start a chat</span>
                
                <img src='data:image/jpeg;base64,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'
                alt='no conversation' className='h-1/2 w-1/2 ml-36 mt-28'/>
            </>)
            }
            
        </div>
    </div>
</div>



   </>
  )
}

export default Messenger