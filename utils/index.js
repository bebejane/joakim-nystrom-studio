

const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

const imageBrightness = async (image) => {
	if(!image) return 1;
  const pixelAverage = require('pixel-average')
	const url = `${image.url}?fmt=jpg`
	return new Promise((resolve, reject)=> pixelAverage(url, (err, {brightness}) => err ? reject(err) : resolve(brightness/255)))
}

const clamp = (number, min, max) => {
  return Math.max(min, Math.min(number, max));
}

const isServer = typeof window === 'undefined'

export {
 imageColor,
 imageBrightness,
 isServer,
 clamp
}