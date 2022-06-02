let textItems = new Array();
let imageItems = new Array();
let spriteItems = new Array();
let spriteManifest=null;

let offscreenCanvas = document.createElement('canvas');

function delay(ms)
{
	return new Promise(r => setTimeout(r, ms));
}

function getSpriteManifest()
{
	return spriteManifest;
}

async function initGameAsync()
{
	var res = await axios('sprites/manifest.json');	
	spriteManifest = res.data;	
	//预加载图片
	spriteManifest.forEach(function(sprite){
		var spriteName = sprite.name;
		var animations = sprite.animations;
		animations.forEach(function(ani){
			var animationName = ani.name;
			var fileNames = ani.fileNames;
			fileNames.forEach(function(fn){
				var imgSrc="sprites/"+spriteName+"/"+animationName+"/"+fn;
				new Image().src = imgSrc;
			});
		});
	});
}

async function loadGameAsync(canvas,fps)
{	
    if(!fps)
	{
		fps=20;
	}
	setInterval(function(){
		for(var i=0;i<spriteItems.length;i++)
		{
			var item = spriteItems[i];
			let currentFrameIndex = item.currentFrameIndex;
			currentFrameIndex++;
			if (currentFrameIndex >= item.frameImages.length)
			{
				currentFrameIndex = 0;//如果到了最后一张，则重新回到第一张
			}
			item.currentFrameIndex = currentFrameIndex;//更换为下一张			
		}
	},1000/fps);	
	let renderFrame=function()
	{		
		//对于canvas绘制来讲，requestAnimationFrame比setInterval性能更好
		window.requestAnimationFrame(renderFrame);
		rpDisplay(canvas);
	}
	renderFrame();
}

function clearGame()
{
	textItems=[];//clear previous items
	imageItems=[];
	spriteItems=[];	
}

function TextItem(num,txt)
{
	this.num=num;
	this.text=txt;
	this.x=0;
	this.y=0;
	this.visible=true;
	this.color='#000000';
	this.font="20px sans-serif";
}

function findText(num)
{
	var items = textItems.filter(e=>e.num==num);
	if(items.length<=0)
	{
		return null;
	}
	else
	{
		return items[0];
	}	
}
function createText(num,txt)
{
	if(findText(num)!=null)
		throw "Error! Text:"+num+" already exists";
	let txtItem = new TextItem(num,txt);
	textItems.push(txtItem);
}
function setTextPosition(num, x, y)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.x=x;
		txtItem.y=y;
	}
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}
}
function setText(num, text)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.text = text;
	}	
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}	
}

function setTextColor(num, color)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.color = color;
	}	
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}	
}

function setTextFont(num, font)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.font = font;
	}	
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}	
}

function hideText(num)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.visible = false;
	}
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}	
}

function showText(num)
{
	let txtItem = findText(num);
	if(txtItem)
	{
		txtItem.visible = true;
	}
	else
	{
		throw "Error! Text="+num+" doesn't exist";
	}	
}

function _createImg(url)
{
	let img = new Image();
	img.loaded = false;
	img.onload=function()
	{
		img.loaded = true;	
	}
	img.src = url;
	return img;
}

function ImageItem(num, imgURL)
{
	this.num=num;
    this.imgLoaded=false;
	this.img=_createImg(imgURL);
	this.x=0;
	this.y=0;
	this.visible=true;	
}

function findImage(num)
{
	var items = imageItems.filter(e=>e.num==num);
	if(items.length<=0)
	{
		return null;
	}
	else
	{
		return items[0];
	}	
}
function createImage(num,imageURL)
{
	if(findImage(num)!=null)
		throw "Error! Image:"+num+" already exists";
	let item = new ImageItem(num,imageURL);
	imageItems.push(item);
}
function setImagePosition(num, x, y)
{
	let item = findImage(num);
	if(item)
	{
		item.x=x;
		item.y=y;
	}
	else
	{
		throw "Error! Image="+num+" doesn't exist";
	}	
}

function setImageURL(num, imgURL)
{
	let item = findImage(num);
	if(item)
	{
		let img = _createImg(imgURL);
		item.img=img;
	}	
	else
	{
		throw "Error! Image="+num+" doesn't exist";
	}	
}

function showImage(num)
{
	let item = findImage(num);
	if(item)
	{
		item.visible=true;
	}	
	else
	{
		throw "Error! Image="+num+" doesn't exist";
	}	
}

function hideImage(num)
{
	let item = findImage(num);
	if(item)
	{
		item.visible=false;
	}	
	else
	{
		throw "Image="+num+" doesn't exist";
	}	
}

function SpriteItem(num,spriteName)
{
	this.num=num;
	this.spriteName=spriteName;
	this.currentAnimationName=null;//当前动作名
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.frameImages=new Array();//帧画面的数组
	this.currentFrameIndex=-1;
	this.visible=true;
	this.xFlipped=false;
	this.yFlipped=false;
}

function findSprite(num)
{
	var items = spriteItems.filter(e=>e.num==num);
	if(items.length<=0)
	{
		return null;
	}
	else
	{
		return items[0];
	}	
}
function createSprite(num,spriteName)
{
	if(findSprite(num)!=null)
		throw "Error! Sprite:"+num+" already exists";
	let item = new SpriteItem(num,spriteName);
	spriteItems.push(item);
}

function setSpritePosition(num, x, y)
{
	let item = findSprite(num);
	if(item)
	{
		item.x=x;
		item.y=y;
	}
	else
	{
		throw "Sprite="+num+" doesn't exist";
	}	
}

function setSpriteXFlipped(num, value)
{
	let item = findSprite(num);
	if(item)
	{
		item.xFlipped=value;
	}	
	else
	{
		throw "Sprite="+num+" doesn't exist";
	}	
}

function setSpriteYFlipped(num, value)
{
	let item = findSprite(num);
	if(item)
	{
		item.yFlipped=value;
	}	
	else
	{
		throw "Sprite="+num+" doesn't exist";
	}	
}

function showSprite(num)
{
	let item = findSprite(num);
	if(item)
	{
		item.visible=true;
	}
	else
	{
		throw "Sprite="+num+" doesn't exist";
	}	
}

function hideSprite(num)
{
	let item = findSprite(num);
	if(item)
	{
		item.visible=false;
	}	
	else
	{
		throw "Sprite="+num+" doesn't exist";
	}	
}

function playSpriteAnimation(num, animateName)
{
	let item = findSprite(num);
	if(!item)
	{
		throw "Sprite="+num+" doesn't exist";
	}	
	if(item.currentAnimationName==animateName)return;
	item.frameFilePaths=new Array();
	item.currentAnimationName = animateName;
	item.currentFrameIndex = 0;
	let sprite = spriteManifest.filter(s=>s.name==item.spriteName)[0];
	let animation = sprite.animations.filter(a=>a.name==animateName)[0];
	item.frameImages = new Array();
	for(var i=0;i<animation.fileNames.length;i++)
	{
		let imgName = animation.fileNames[i];
		let imgURL = "sprites/"+item.spriteName+"/"
			+animateName+"/"+imgName;
		let img = _createImg(imgURL);
		item.frameImages.push(img);
	}
}

function rpDisplay(canvas)
{
	let width = canvas.width;
	let height = canvas.height;
	offscreenCanvas.width = width;
	offscreenCanvas.height = height;
	
	let offscreenCtx = offscreenCanvas.getContext('2d');
	offscreenCtx.textBaseline = 'top';//https://segmentfault.com/q/1010000008657193
	offscreenCtx.clearRect(0, 0, width, height);

	for(var i=0;i<imageItems.length;i++)
	{
		let item = imageItems[i];
		var img = item.img;
		if(!item.visible||!img.loaded) continue;
		offscreenCtx.drawImage(item.img,item.x,item.y);
	}
	for(var i=0;i<spriteItems.length;i++)
	{
		let spriteItem = spriteItems[i];
		if(!spriteItem.visible) continue;

		let currentFrameIndex = spriteItem.currentFrameIndex;
		if(currentFrameIndex>=spriteItem.frameImages.length)continue;
		let currentFrameImg = spriteItem.frameImages[currentFrameIndex];
		if (!currentFrameImg.loaded) continue;
		let imgHeight =currentFrameImg.height;
		let imgWidth = currentFrameImg.width;
		spriteItem.height = imgHeight;
		spriteItem.width = imgWidth;
		let posX = spriteItem.x;
		let posY = spriteItem.y;
		let scaleX=spriteItem.xFlipped?-1:1;
		let scaleY=spriteItem.yFlipped?-1:1;		
		offscreenCtx.save();
		offscreenCtx.translate(imgWidth*(1-scaleX)/2, 
			imgHeight*(1-scaleY)/2);
		offscreenCtx.scale(scaleX,scaleY);
		offscreenCtx.drawImage(currentFrameImg,posX,posY);
		offscreenCtx.restore();
	}
	for(var i=0;i<textItems.length;i++)
	{
		let item = textItems[i];
		if(!item.visible) continue;
		offscreenCtx.save();		
		offscreenCtx.font = item.font;
		offscreenCtx.fillStyle= item.color;
		offscreenCtx.fillText(item.text, item.x, item.y);
		offscreenCtx.restore();
	}	
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(offscreenCanvas, 0, 0);
}