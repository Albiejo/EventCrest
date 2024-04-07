import { Typography } from "@material-tailwind/react";
import SubsribeCard from "./SubsribeCard";

const LINKS = [
  {
    title: "Company",
    items: ["About us", "Contact us"],
  },
  {
    title: "Resource",
    items: ["Blog", "Newsletter", "Events", "Help center"],
  },
];
 
const currentYear = new Date().getFullYear();
 
const Footer=()=> {
  return (
    <footer className="relative w-full pt-5" style={{ backgroundColor: "#367588" }}>
  <div className="mx-auto w-full max-w-7xl px-8">
    <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
      <Typography variant="h5" className="mb-6" color="white"  placeholder={undefined}>
        Event Crest
      </Typography>

      <div className="grid grid-cols-3 justify-between gap-4">
        {LINKS.map(({ title, items }) => (
          <ul key={title}>
            <Typography variant="small" color="white" className="mb-3 font-medium opacity-40"  placeholder={undefined}>
              {title}
            </Typography>
            {items.map((link) => (
              <li key={link}>
                <Typography as="a" href="#" color="white" className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"  placeholder={undefined}>
                  {link}
                </Typography>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>

    <div className="pb-5 p-10 md:pt-10 max-w-4xl mx-auto"> {/* Adjusted size for subscribe card */}
      <SubsribeCard />
    </div>

    <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-center">
      <Typography variant="small" className="mb-4 text-center font-normal text-white md:mb-0"  placeholder={undefined}>
        &copy; {currentYear} <a href="https://material-tailwind.com/">Event Crest</a>. All Rights Reserved.
      </Typography>
    </div>
  </div>
</footer>

  );
}


export default Footer;