import AuthButton from './AuthButton';
import NavMenu from './NavMenu';
import ThemeSwitcher from './ThemeSwitcher';
import NavLogo from './NavLogo';
import NavButton from './NavButton';
import GitHubButton from '@/components/GitHubButton';

const Navbar = () => {
  return (
    <div className="z-50 navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start gap-2 flex items-center justify-start">
        <NavButton className="md:hidden" />
        <NavLogo />
      </div>
      <div className="navbar-center gap-1 hidden md:flex">
        <NavMenu />
      </div>
      <div className="navbar-end flex items-center my-auto gap-2">
        <GitHubButton />
        {/* <ThemeSwitcher /> */}
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
