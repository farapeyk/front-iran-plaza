import type { SocialName } from '@/design/components/social-media-icon';
const names:Record<string,SocialName>={instagram:'Instagram',telegram:'Telegram',whatsapp:'Whatsapp',website:'Website',facebook:'Facebook',linkedin:'Linkedin',x:'X',youtube:'Youtube',aparat:'Aparat',eitaa:'Eita',bale:'Bale',rubika:'Roobika',soroush:'Soroush'};
const bases:Record<string,string>={instagram:'https://www.instagram.com/',telegram:'https://t.me/',aparat:'https://www.aparat.com/',x:'https://x.com/',eitaa:'https://eitaa.com/',bale:'https://ble.ir/'};
export function socialLinks(value:unknown):{name:SocialName;href:string}[]{
  if(!value||typeof value!=='object'||Array.isArray(value))return [];
  return Object.entries(value).flatMap(([key,raw])=>{
    const platform=key.toLowerCase();if(typeof raw!=='string'||!names[platform])return [];
    let href=raw.trim();if(!href)return [];
    if(!/^https?:\/\//i.test(href)){
      if(platform==='whatsapp'&&/^\+?\d{10,15}$/.test(href))href='https://wa.me/'+href.replace(/^0/,'98').replace(/^\+/,'');
      else if(bases[platform]&&/^@?[\w.-]+$/.test(href))href=bases[platform]+encodeURIComponent(href.replace(/^@/,''));
      else return [];
    }
    try{const url=new URL(href);if(url.username||url.password||!['http:','https:'].includes(url.protocol))return [];return [{name:names[platform],href:url.href}];}catch{return [];}
  });
}
