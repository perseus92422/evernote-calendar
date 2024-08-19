'use client'
import { Provider } from 'react-redux';
import { registerLocale } from 'react-datepicker';
import { ToastContainer } from 'react-toastify';
import { zhCN, enUS } from 'date-fns/locale';
import { Inter } from "next/font/google";
import { Theme } from '@radix-ui/themes';
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import '@radix-ui/themes/styles.css';
import '@radix-ui/themes/tokens.css';
import '@radix-ui/themes/components.css';
import '@radix-ui/themes/utilities.css';
import '@radix-ui/themes/layout.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.css';
import 'moment/locale/en-ca';
import 'moment/locale/zh-cn';
import { store } from './redux/store';
import Header from './components/header/Header';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  registerLocale('en', enUS);
  registerLocale('cn', zhCN);

  return (
    <html lang="en">
      <body >
        <Provider store={store}>
          <Theme>
            <div className='container mx-auto px-4'>
              <Header />
              {children}
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>

          </Theme>
        </Provider>
      </body>
    </html>
  );
}
