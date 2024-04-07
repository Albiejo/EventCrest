import { Button, Input, Typography } from '@material-tailwind/react'
import React from 'react'

const SubsribeCard = () => {
  return (
    <div className="pb-5 p-10 md:pt-10">
      <div className="container mx-auto items-center justify-center">
        <div className="relative flex w-full py-10 mb-5 md:mb-20 max-w-4xl mx-auto rounded-2xl p-5 bg-[url('/imgs/bg-6.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black opacity-30 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full">
            <Typography className="text-xl md:text-2xl font-bold mb-3" color="white"  placeholder={undefined}>
              Join our community!
            </Typography>
            <Typography className="md:w-9/12 text-base" color="white"  placeholder={undefined}>
              Get news in your inbox every week! We hate spam too, so no worries about this.
            </Typography>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="w-full md:w-auto">
                <Input label="Email" color="white" crossOrigin={undefined} />
              </div>
              <Button size="md" className="w-full md:w-auto lg:w-32" fullWidth color="white"  placeholder={undefined}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SubsribeCard