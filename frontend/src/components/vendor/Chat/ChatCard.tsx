import { Link } from 'react-router-dom';
import { Chat } from '../../../Types/chat';
import head from '../../../../public/imgs/head.png'

const chatData: Chat[] = [
  {
    avatar: head,
    name: 'Devid Heilo',
    text: 'How are you?',
    time: 12,
    textCount: 3,
    color: '#10B981',
  },
  {
    avatar: head,
    name: 'Henry Fisher',
    text: 'Waiting for you!',
    time: 12,
    textCount: 0,
    color: '#DC3545',
  },
  {
    avatar: head,
    name: 'Jhon Doe',
    text: "What's up?",
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: head,
    name: 'Jane Doe',
    text: 'Great',
    time: 32,
    textCount: 2,
    color: '#FFBA00',
  },
  {
    avatar: head,
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: head,
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 3,
    color: '#FFBA00',
  },
];

const ChatCard = () => {
  return (
    <div className="col-span-12 xl:col-span-4">
      {chatData.map((chat, key) => (
        <Link
          to="/"
          className="block rounded-sm border border-warning border-stroke bg-white mb-4 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg"
          key={key}
        >
          <div className="p-6 bg-[#D0915C] bg-opacity-30" >
            <div className="flex items-center gap-5">
              <div className="relative h-14 w-14 rounded-full">
                <img src={chat.avatar} alt="User" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    {chat.name}
                  </h5>
                  <p>
                    <span className="text-sm text-black dark:text-white">
                      {chat.text}
                    </span>
                    <span className="text-xs"> . {chat.time} min</span>
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatCard;
