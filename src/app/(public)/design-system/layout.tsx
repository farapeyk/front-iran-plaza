import {notFound} from 'next/navigation';
export const metadata={robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}) { if(process.env.NODE_ENV==='production' && process.env.DESIGN_REVIEW_ENABLED!=='true') notFound(); return children; }
