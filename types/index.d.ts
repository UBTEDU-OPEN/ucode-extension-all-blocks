/*
 * @Description:
 * @Create by: bright.lin
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-05-05 13:57:26
 */

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}
