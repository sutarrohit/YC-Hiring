"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    return (
        <nav className='border-b border-gray-100 dark:border-neutral-900 bg-white/80 dark:bg-[#050505]/80 transition-colors sticky top-0 z-50 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 items-center'>
                    <div className='flex items-center gap-8'>
                        <Link href='/' className='flex items-center gap-2'>
                            <div className='size-8 bg-orange-500 text-white font-bold flex items-center justify-center rounded text-xl'>
                                Y
                            </div>
                            <span className='text-xl font-bold text-gray-900 dark:text-white'>YC Hiring</span>
                        </Link>

                        <div className='hidden md:flex gap-6'>
                            <Link
                                href='/'
                                className='text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors'
                            >
                                Hiring Companies
                            </Link>
                            <Link
                                href='/all-companies'
                                className='text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors'
                            >
                                All Companies
                            </Link>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <a
                            href='https://github.com/yc-oss'
                            target='_blank'
                            rel='noreferrer'
                            className='hidden sm:block text-sm text-gray-500 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors'
                        >
                            Data Source
                        </a>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
