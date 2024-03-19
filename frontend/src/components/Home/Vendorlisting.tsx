import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
  } from "@material-tailwind/react";
   
  export function ProfileCard() {
    return (
      <Card className="w-96" placeholder={undefined}>
        <CardHeader floated={false} className="h-80" placeholder={undefined}>
          <img src="https://docs.material-tailwind.com/img/team-3.jpg" alt="profile-picture" />
        </CardHeader>
        <CardBody className="text-center" placeholder={undefined}>
          <Typography variant="h4" color="blue-gray" className="mb-2" placeholder={undefined}>
            Natalie Paisley
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient placeholder={undefined}>
            CEO / Co-Founder
          </Typography>
        </CardBody>
        <CardFooter className="flex justify-center gap-7 pt-2" placeholder={undefined}>
          <Tooltip content="Like">
            <Typography
                        as="a"
                        href="#facebook"
                        variant="lead"
                        color="blue"
                        textGradient placeholder={undefined}            >
              <i className="fab fa-facebook" />
            </Typography>
          </Tooltip>
          <Tooltip content="Follow">
            <Typography
                        as="a"
                        href="#twitter"
                        variant="lead"
                        color="light-blue"
                        textGradient placeholder={undefined}            >
              <i className="fab fa-twitter" />
            </Typography>
          </Tooltip>
          <Tooltip content="Follow">
            <Typography
                        as="a"
                        href="#instagram"
                        variant="lead"
                        color="purple"
                        textGradient placeholder={undefined}            >
              <i className="fab fa-instagram" />
            </Typography>
          </Tooltip>
        </CardFooter>
      </Card>
    );
  }