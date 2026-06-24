import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  image?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export default function AuthLayout({
  children,
  image = "/images/Colloborate.png",
  heroTitle,
  heroSubtitle,
}: AuthLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-1 max-md:flex-col'>
        <div className='flex-1 bg-[#f4f5f7] flex flex-col items-center justify-center p-10 text-center'>
          <div className='w-full max-w-[350px] mb-8'>
            <img
              src={image}
              alt='Student Talent Hub'
              className='w-full h-auto'
            />
          </div>
          {heroTitle && (
            <h1 className='font-heading text-[2.2rem] font-bold leading-tight text-primary mb-5'>
              {heroTitle}
            </h1>
          )}
          {heroSubtitle && (
            <p className='text-[#555] text-base leading-relaxed max-w-[450px] font-body'>
              {heroSubtitle}
            </p>
          )}
        </div>
        <div className='flex-1 flex flex-col items-center justify-center p-10 bg-white'>
          {children}
        </div>
      </div>
      <footer className='flex justify-center items-center px-10 py-5 bg-[#fcfcfc] border-t border-[#eaeaea] text-xs text-[#777] font-semibold max-md:flex-col max-md:gap-2.5 max-md:text-center'>
        <span>
          © 2026 Student Talent Hub. Empowering the next generation of
          professionals.
        </span>
      </footer>
    </div>
  );
}
