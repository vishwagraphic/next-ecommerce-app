import { APP_NAME } from "@/lib/constants";

const Footer = () => {
    return (
      <footer className="w-full border-t py-10">
        <div className="wrapper">
          <p className="text-center">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    );
}
 
export default Footer;