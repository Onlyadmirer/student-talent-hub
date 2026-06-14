export default function Header({ user, onLogout, onToggleSidebar }) {
  return (
    <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onToggleSidebar}
          className='p-2 text-slate-500 rounded-md lg:hidden hover:bg-slate-100 focus:outline-none'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <div className='font-bold text-xl text-[#0a4b39]'>
          Student Talent Hub
        </div>
      </div>

      <div className='flex-1 max-w-2xl px-4 hidden sm:block'>
        <div className='relative'>
          <svg
            className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <input
            type='text'
            placeholder='Search...'
            className='w-full bg-slate-100 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#0a4b39]/20 transition-all'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='text-sm text-right hidden sm:block'>
          <p className='font-medium text-slate-800'>{user.name}</p>
          <p className='text-slate-500 capitalize text-xs'>{user.role}</p>
        </div>
        <button className='text-slate-500 hover:text-[#0a4b39]'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
        </button>
        <div className='w-8 h-8 rounded-full bg-[#0a4b39] flex items-center justify-center text-white text-sm font-bold uppercase shrink-0'>
          {user.name.charAt(0)}
        </div>
        <button
          onClick={onLogout}
          className='text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors'
        >
          Logout
        </button>
      </div>
    </header>
  );
}
