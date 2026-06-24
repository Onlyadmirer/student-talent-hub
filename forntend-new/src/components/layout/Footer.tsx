export default function Footer() {
  return (
    <footer className='col-span-2 flex justify-between items-center px-10 py-5 bg-white border-t border-[#eaeaea] text-xs text-[#777] font-semibold max-md:flex-col max-md:gap-2.5 max-md:text-center'>
      <span>
        © 2026 Student Talent Hub. Empowering the next generation of
        professionals.
      </span>
      <div className='flex gap-5'>
        <a href='#' className='text-[#777] no-underline hover:text-[#333]'>
          Privacy Policy
        </a>
        <a href='#' className='text-[#777] no-underline hover:text-[#333]'>
          Terms of Service
        </a>
        <a href='#' className='text-[#777] no-underline hover:text-[#333]'>
          Help Center
        </a>
      </div>
    </footer>
  );
}
