const duration = 0.4;
const variants =  { 
	initial:{
		translateY:'0vh'
	},
	artwork:{
		translateY:['100vh', '0vh'],
		transition:{ease:'easeOut', duration}
	},
	fromStudio:{
		opacity:1,
		transition:{ease:'easeOut', duration}
	},
	toArtwork:{
		translateY:'100vh',
		transition:{ease:'easeOut', duration}
	},
	toStudio:{
		opacity:0,
		transition:{ease:'easeOut', duration}
	}
}

export default variants;