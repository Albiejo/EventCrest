
import './vendorMessenger.css'
import Conversation from '../../../Components/vendor/Conversations/Conversation';
import Message from '../../../Components/user/messages/Message';

import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import VendorRootState from '../../../Redux/rootstate/VendorState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io} from 'socket.io-client'





const Messenger = () => {

    const user = useSelector((state: UserRootState) => state.user.userdata);
    const vendorData = useSelector(
        (state: VendorRootState) => state.vendor.vendordata,
      );
    const [conversation , setconversation] = useState([]);
    const [currentchat , setcurrentchat]  = useState(null);
    const [messages , setmessages] = useState([]);
    const [arrivalMessage , setArrivalMessage] = useState(null)
    const [newMessage, setnewMessage] = useState("");
    const [typing , setTyping] = useState(false);

    const scrollRef = useRef()
    const socket = useRef(io("ws://localhost:8900")); 




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
            console.log("user typing ")
            setTyping(true);
        })

        socket.current.on("stopTypingsent" , (senderId)=>{
            console.log("user stopped typing")
            setTyping(false);
        })

    },[])





    useEffect(()=>{
        arrivalMessage && currentchat?.members.includes(arrivalMessage.sender) &&
        setmessages((prev)=>[...prev , arrivalMessage])  
    },[arrivalMessage , currentchat])







    useEffect(()=>{
        console.log(vendorData)
        socket.current.emit("adduser" , vendorData?._id);
        socket.current.on("getUsers" , (users)=>{
            console.log(users)
        })
    },[user])





    //getting conversations
    useEffect(()=>{
        const getconversation = async()=>{  
            try {
                const res = await axiosInstanceChat.get(`/?userId=${vendorData?._id}`)
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
    


    const receiverId = currentchat?.members.find((member)=>member !==vendorData?._id)

     const handleSubmit=async(e)=>{
        e.preventDefault();

        const message = {
            senderId: vendorData?._id,
            text:newMessage,
            conversationId: currentchat?._id
        };

   
        console.log(receiverId);
        
        socket.current.emit("sendMessage" , {
            senderId : vendorData?._id,
            receiverId,
            text:newMessage
        })
        
        try {
                axiosInstanceMsg.post('/' , message).then((res)=>{
                setmessages([...messages , res.data]);
                setnewMessage("")
            })
          
        } catch (error) {
            console.log(error)
        }

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


  return (
   <>

   <div className='navbar'>
    
   </div>
   
   <div className="messenger">
    <div className="chatmenu">
        <div className="chatmenuWrapper" >
           <input placeholder='Search for friends' className='chatmenuInput'/>
          
          
          
           {conversation.map((c) => (
                <div onClick={()=> setcurrentchat(c)}>
                <Conversation  conversation={c} currentUser={vendorData}/>
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
                            <Message message={m} own={m.senderId === vendorData?._id}/>
                        </div>
                    ))}

                   {typing && (
                     <div className='userTyping'>Typing...</div>
                    )}
                    
                </div>
            <div className="chatboxBottom">
                <textarea className='chatMessageInput' placeholder='write something..'onChange={handleInputChange} value={newMessage}  onBlur={handleStopTyping}></textarea>
                <button className='chatSubmitButton' onClick={handleSubmit}>send</button>
            </div>
                </> ):( <span className='noConversationtext'>open a conversation to start a chat</span>)
            }
            
        </div>
    </div>
   </div>

   </>
  )
}

export default Messenger