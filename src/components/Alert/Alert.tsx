import { FC, ReactNode } from 'react';

interface Props
{
  type?: 'Error' | 'Warning' | 'Success' | 'Info' | 'Notification'
  title?: string;
  children: ReactNode;
}
const Alert: FC<Props> = ({ type = 'Notification', title, children }) =>
{
  switch (type)
  {
    case 'Error':
      {
        return (
          <div className="flex w-full max-w-sm mx-auto overflow-hidden ring-1 ring-red-300 rounded shadow-md shadow-red-200 dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-red-500">
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
              </svg>
            </div>
            <div className="px-4 py-3 -mx-3">
              <div className="mx-3">
                {
                  title &&
                  <span className="font-semibold text-red-500 dark:text-red-400">{title}</span>
                }
                <p className="text-sm text-gray-600 dark:text-gray-200">{children}</p>
              </div>
            </div>
          </div>
        );
      }
    case 'Info':
      {
        return (
          <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white ring-1 ring-blue-300 rounded shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-blue-500">
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
              </svg>
            </div>
            <div className="px-4 py-3 -mx-3">
              <div className="mx-3">
                {
                  title &&
                  <span className="font-semibold text-blue-500 dark:text-blue-400">{title}</span>
                }
                <p className="text-sm text-gray-600 dark:text-gray-200">{children}</p>
              </div>
            </div>
          </div>
        );
      }
    case 'Success':
      {
        return (
          <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white ring-1 ring-emerald-300 rounded shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-emerald-500">
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
              </svg>
            </div>
            <div className="px-4 py-3 -mx-3">
              <div className="mx-3">
                {
                  title &&
                  <span className="font-semibold text-emerald-500 dark:text-emerald-400">{title}</span>
                }
                <p className="text-sm text-gray-600 dark:text-gray-200">{children}</p>
              </div>
            </div>
          </div>
        );
      }
    case 'Warning':
      {
        return (
          <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white ring-1 ring-yellow-300 rounded shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-yellow-400">
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
              </svg>
            </div>
            <div className="px-4 py-3 -mx-3">
              <div className="mx-3">
                {
                  title &&
                  <span className="font-semibold text-yellow-500 dark:text-yellow-400">{title}</span>
                }
                <p className="text-sm text-gray-600 dark:text-gray-200">{children}</p>
              </div>
            </div>
          </div>
        );
      }
    default:
      {
        return (
          <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white ring-1 ring-gray-300 rounded shadow-md dark:bg-gray-800">
            <div className="w-2 bg-gray-800 dark:bg-gray-900"></div>
            <div className="px-2 py-3 -mx-3">
              <div className="mx-3">
                {
                  title &&
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{title}</span>
                }
                <p className="text-sm text-gray-600 dark:text-gray-200">{children}</p>
              </div>
            </div>
          </div>
        );
      }
  }

}

export default Alert;
