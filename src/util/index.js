/**
 * 将 00:00 转换成纯秒数
 */
export const convert = (time)=>{
  let min = time.split(':')[0] * 60
  let sec = parseFloat(time.split(':')[1]);
  return parseInt(min+sec);
}

/**
 * 将纯秒数转换为 00:00
 */
export const reverseConvert = (time) => {
  let min = parseInt(time / 60);
  let sec = parseInt(time%60);
  if(min<10) min = '0'+min;
  if(sec<10) sec = '0'+sec;
  return min +':'+sec;
}