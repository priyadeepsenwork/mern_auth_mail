import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <section className="flex justify-between align-center pt-3 pb-3 pl-20 pr-20 border-5">
      <div className="text-3xl text-[#ff004f]">
        <h1>Senn.MernMail</h1>
      </div>
      <div className="text-2xl"><ModeToggle /></div>
    </section>
  );
};

export default Header;
