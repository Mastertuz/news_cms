import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
  remotePatterns:[
    new URL('https://j9l81ubzrs.ufs.sh/f/**'),
    new URL('https://cdnn21.img.ria.ru/images/07e9/04/1c/2013784766_0:321:3072:2048_768x0_80_0_0_a86a9e32ba03335b4e7bd2c07df6901c.jpg.webp')
  ]
 }
};

export default nextConfig;
