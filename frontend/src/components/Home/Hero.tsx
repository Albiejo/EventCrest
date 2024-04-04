import { Typography, Input, Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Hero = () => {

const navigate = useNavigate()
  return (
    <>
       <header  style={{ marginBottom: -40  , marginTop:-2}}>

        <div className="grid min-h-[30vh] w-full lg:h-[50rem] md:h-[30rem] place-items-stretch bg-[url('/imgs/herosea.jpg')] bg-cover bg-no-repeat">         
          <div className="container mx-auto text-end my-auto ">

            <Card style={{ backgroundColor: "#367588"}} className="inline-flex text-xs rounded-lg font-medium text-primary" placeholder={undefined}>
                <CardBody placeholder={undefined}>
                  <div className="flex justify-end"> 
                    <Typography
                      variant="h1"
                      color="white"
                      className="mx-5 w-full leading-snug !text-3xl lg:max-w-xl lg:!text-3xl"
                      placeholder={undefined}
                    >
                     Make Your Events Memorable
                    </Typography>

                  </div>
                </CardBody>
            </Card>

            <div className="mt-8 grid w-full place-items-start md:justify-end">
              <div className="mb-2 flex w-full flex-col gap-4 md:flex-row justify-end">
                {/* <Input color="gray" label="Looking for a vendor?" size="lg" className="bg-white" crossOrigin={undefined} /> */}
                <Button
                  color="gray"
                  className="w-full px-4 md:w-[15rem]"
                  placeholder={undefined}
                  onClick={()=>{navigate('/vendors')}}
                >
                 I'm looking for a vendor
                </Button>
              </div>
            </div>

          </div>
        </div>

      </header>
    </>
  );
};

export default Hero;
