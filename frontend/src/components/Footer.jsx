"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

// Logo import
import Logo from "../assets/logo/logo.webp";

const Footer = () => {
  return (
    <footer className="bg-[#F8F3F3] text-black">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand + Description + Social Icons */}
        <div className="lg:col-span-2">
          <img
            src={Logo.src}
            alt="The English Raj Logo"
            className="h-14 sm:h-10 lg:h-20 mb-4"
          />

          <p className="text-md text-black/80 leading-relaxed max-w-md">
            The English Raj empowers learners and tutors through personalized
            English education, flexible schedules, and real-world communication
            mastery.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5 text-xl text-black/70">

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>

            <a
              href="https://www.linkedin.com/company/theenglishraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>

            <a
              href="https://www.youtube.com/@theenglishraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>

            <a
              href="https://www.facebook.com/theenglishraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>

            <a
              href="https://twitter.com/theenglishraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>

            <a
              href="https://www.instagram.com/theenglishraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="hover:text-black hover:scale-110 transition cursor-pointer" />
            </a>
            
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold mb-4 text-lg">Company</h4>
          <ul className="space-y-2 text-md text-black/80">
            <li><Link href="/#goal">Goal</Link></li>
            <li><Link href="/CoursesPricing">Pricing</Link></li>
            <li><Link href="/#review">Review</Link></li>
            <li><Link href="/#book-a-session">Book a Session</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        
        <div>
          <h4 className="font-bold mb-4 text-lg">Support</h4>
          <ul className="space-y-2 text-md text-black/80">
            <li><Link href="/support">Help & Support</Link></li>
            <li><Link href="/become-tutor">Become Instructor</Link></li>
            <li><Link href="/app">Get the App</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/tutorial">Tutorial</Link></li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="font-bold mb-4 text-lg">Get in touch</h4>

          <p className="text-sm text-black/80 mb-1">
            <strong>Email:</strong> support@theenglishraj.com
          </p>

          <p className="text-sm text-black/80">
            <strong>Phone:</strong> +91 90413-23089
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-center md:text-left text-black/70">
            © {new Date().getFullYear()} The English Raj. All Rights Reserved.
          </p>
        </div>
          
        {/* Legal Links */}
        <div className="text-center text-xs text-black/60 pb-6">
          <Link href="/privacy" className="mx-2 hover:underline">Privacy</Link>
          |
          <Link href="/terms" className="mx-2 hover:underline">Terms</Link>
          |
          <Link href="/cookies" className="mx-2 hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
