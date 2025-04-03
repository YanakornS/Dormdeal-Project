import Logo from "/Logo/logo.png";
const Footer = () => {
  return (
    <footer className="section-container footer sm:footer-horizontal items-center shadow-sm rounded-t-lg p-4">
      <aside className="grid-flow-col items-center">
        <a
          className="flex items-center text-xl hover:scale-105 transition transform duration-300"
          href="/"
        >
          <img
            src={Logo}
            alt="DormDeals Logo"
            className="h-6 lg:h-8 pr-1 mr-2"
          />
          <span className="font-bold">DormDeals</span>
        </a>
      </aside>

      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <div className="text-center md:text-left">
          © 2024 DormDeals, All Rights Reserved.
        </div>
        <a href="/terms" className="text-vivid hover:underline">
          Terms & Conditions
        </a>
        <span className="text-gray-400">|</span>
        <a href="/privacy" className="text-vivid hover:underline">
          Privacy Policy
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
