import { YCCompany } from "@/types";
import Link from "next/link";

interface CompanyCardProps {
    company: YCCompany;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <div className='bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm hover:shadow-md hover:border-orange-600 dark:hover:border-orange-600 transition-all duration-200 flex flex-col h-full overflow-hidden group'>
            <div className='p-5 flex-grow'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center space-x-3'>
                        {company.small_logo_thumb_url && (
                            <img
                                src={company.small_logo_thumb_url}
                                alt={`${company.name} logo`}
                                className='w-12 h-12 rounded bg-white object-contain border border-gray-100 dark:border-transparent'
                            />
                        )}
                        <div>
                            <h3 className='font-bold text-lg text-gray-900 dark:text-neutral-100 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
                                {company.name}
                            </h3>
                            <div className='flex flex-wrap gap-1 mt-1'>
                                <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-orange-400 border border-gray-200 dark:border-neutral-700'>
                                    {company.batch}
                                </span>
                                {company.stage && (
                                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50'>
                                        {company.stage}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className='text-sm text-gray-600 dark:text-neutral-400 mb-4 line-clamp-3'>{company.one_liner}</p>

                <div className='flex flex-wrap gap-2 mb-2'>
                    {company.industries?.slice(0, 2).map((ind) => (
                        <span
                            key={ind}
                            className='text-xs text-gray-500 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700'
                        >
                            {ind}
                        </span>
                    ))}
                </div>

                {company.all_locations && (
                    <p className='text-xs text-gray-500 dark:text-neutral-600 mt-2 truncate'>
                        📍 {company.all_locations}
                    </p>
                )}
            </div>

            <div className='flex flex-col gap-2'>
                <div className='flex flex-wrap gap-4 mt-4 px-4'>
                    <a
                        href={`${company.url}/jobs`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex-grow text-center bg-orange-600 hover:bg-orange-500 text-white py-1 rounded-md font-medium transition-colors size-fit text-sm'
                    >
                        Job
                    </a>

                    <a
                        href={`${company.website}/careers`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex-grow text-center bg-orange-600 hover:bg-orange-500 text-white py-1 rounded-md font-medium transition-colors text-sm'
                    >
                        Career
                    </a>
                </div>

                <div className='bg-gray-50 dark:bg-neutral-950 px-5 py-2 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center text-sm gap-3'>
                    <a
                        href={company.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-300 font-medium'
                    >
                        Website
                    </a>

                    <a
                        href={company.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-300 font-medium'
                    >
                        YC Profile
                    </a>
                </div>
            </div>
        </div>
    );
}
