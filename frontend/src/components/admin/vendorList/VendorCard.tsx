import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";

   
  interface VendorCardProps {
    name: string;
    email: string;
    phone: number;
    city: string;
    
  }


const VendorCard:React.FC<VendorCardProps> =({name , coverpicUrl  })=> {
  return (
    <Card
      shadow={false}
      className="relative w-full max-w-[16rem] border-4 border-gray-700" // Added border style
      placeholder={undefined}    >
      {/* Removed CardHeader */}
      <CardBody className="relative py-14 px-6 md:px-12 text-center" placeholder={undefined}>
        <Typography variant="h5" className="mb-4 text-gray-900 truncate" title={name} placeholder={undefined}>
          {name}
        </Typography>
        {/* Display coverpicUrl image */}
        <img src={coverpicUrl} alt={name} className="w-full h-auto" /> {/* Added image tag */}
      </CardBody>
    </Card>
  );
};


export default VendorCard