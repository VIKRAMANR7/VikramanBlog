import { assets, footer_data } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        <div className="max-w-lg text-center md:text-left">
          <img
            src={assets.logo}
            alt="Vikraman Blog logo"
            className="w-48 sm:w-44 mx-auto md:mx-0"
          />

          <p className="max-w-[410px] mt-6">
            A space to learn, write, and explore technology. Follow the latest insights, tutorials,
            and ideas from our blog.
          </p>
        </div>

        <nav className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:underline transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        © {new Date().getFullYear()} Vikraman Blog • All Rights Reserved
      </p>
    </footer>
  );
}
