import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,

  } from "@material-tailwind/react";

  
  interface VendorCardProps {
    name: string;
    email: string;
    phone: string;
    city: string;
    
  }
   
  const VendorCard: React.FC<VendorCardProps> = ({
    name,city})=> {
    return (
      <Card className="w-60 mr-10 transition duration-300 ease-in-out transform hover:shadow-2xl hover:border-red-500" placeholder={undefined}>
      <CardHeader floated={false} className="h-50" placeholder={undefined}>
        <img src="/imgs/camera.jpeg" alt="profile-picture" />
      </CardHeader>
      <CardBody className="text-center" placeholder={undefined}>
        <Typography variant="h4" color="blue-gray" className="mb-2" placeholder={undefined}>
          {name}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient placeholder={undefined}>
          {city}
        </Typography>
        <Button placeholder={undefined} className="bg-white border border-red-500 text-black hover:bg-red-500 hover:text-white">Click to View</Button>
      </CardBody>
    </Card>
    );
  }


  export default VendorCard;