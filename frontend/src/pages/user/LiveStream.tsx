import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
  } from '@material-tailwind/react';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  
  const LiveStreaming = () => {
    const [roomId, setRoomId] = useState('');
    const navigate=useNavigate()
    const role_str="Host"
  
    const handleJoin=()=>{
      
      navigate(`/room/${roomId}/${role_str}`)
    }
  
    return (
      <div>
        <div className="flex pt-50 justify-center">
          <Card
            className="mt-28 w-96 border-2 border-blue-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Live
              </Typography>
              <Input
                label="Room ID"
                size="lg"
                value={roomId}
                onChange={e=>{setRoomId(e.target.value)}}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </CardBody>
            <CardFooter
              className="pt-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onClick={handleJoin}
              >
                Join
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  export default LiveStreaming;