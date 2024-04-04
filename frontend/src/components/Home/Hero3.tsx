import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Hero3 = () => {
 
  return (
    <header style={{ marginBottom: -40, marginTop: -2 }}>
      <div className="grid min-h-[30vh] w-full lg:h-[45rem] md:h-[30rem] place-items-stretch bg-[url('/imgs/herokissing.jpg')] bg-cover bg-no-repeat">
        <div className="container text-start my-auto">
        
              <Typography
                              variant="h1"
                              color="black"
                              className="mx-5 w-full leading-snug !text-3xl lg:max-w-xl lg:!text-3xl"  placeholder={undefined}              >
                Why Event Crest?
              </Typography>
              <Typography
                              variant="paragraph"
                              color="black"
                              className="mx-5  w-full leading-snug !text-lg lg:max-w-xl lg:!text-lg"  placeholder={undefined}              >
                Because Event Crest is the best choice for your memorable events.
              </Typography>
          
        </div>
      </div>
    </header>
  );
};

export default Hero3;
