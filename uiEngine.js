var uiEngine={
  hexToRgb:function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  },
  getDarkness:function(hexcolor){
    var rgb=uiEngine.hexToRgb(hexcolor)
    return rgb.r+rgb.g+rgb.b
  },
  setStyle:function(astr){
    var css = astr//'table td:hover{ background-color: #00ff00 }';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
  },
  getRandomSeed:function(rng){
    return rng.random().toString(36).substring(7);
  },
  getNewRandom:function(seed){
    var rng
    if(seed){
      rng=new Math.seedrandom(seed)
    }
    else{
      rng=new Math.seedrandom()
    }
    rng.random=rng.quick
    rng.getRandomInt=function(maxint){
      return Math.floor(rng.random() * maxint)
    }
    return rng
  },
  displaySpecification:{
    schemeHue:'random',
    schemeColorVariation:'random',
    bgMethod:'random',
    bg0seed:'random',
    bg1seed:'random',
  },
  randChoice:function(alist,rng){
    return alist[Math.floor(rng.random()*alist.length)]
  },
  fillSpecifications:function(seed){
    var newspec = JSON.parse(JSON.stringify(uiEngine.displaySpecification));
    function isr(athing){
      return athing=='random'
    }
    var rng=uiEngine.getNewRandom(seed)
    var localrng;
    var localseed;
    if(isr(newspec.schemeHue)){
      newspec.schemeHue=Math.floor(140+rng.random() * (340-140))
    }
    if(isr(newspec.schemeColorVariation)){
      newspec.schemeColorVariation='default'
    }
    if(isr(newspec.schemeColorVariation)){
      newspec.schemeColorVariation=uiEngine.randChoice(['default','pastel','soft','light','hard','pale'],rng)
    }
    if(isr(newspec.bgMethod)){
      newspec.bgMethod=Math.floor(rng.random()*4)
    }
    if(isr(newspec.bg0seed)){
      newspec.bg0seed=uiEngine.getRandomSeed(rng)
    }
    if(isr(newspec.bg1seed)){
      newspec.bg1seed=uiEngine.getRandomSeed(rng)
    }
    if(isr(newspec.bg2seed)){
      newspec.bg2seed=uiEngine.getRandomSeed(rng)
    }
    if(isr(newspec.bg3seed)){
      newspec.bg3seed=uiEngine.getRandomSeed(rng)
    }
    return newspec
  },
  transformSite:function(seed){
    // Use "new" to create a local prng without altering Math.random.
    //var myrng = new Math.seedrandom('hello.');
    //Math.seedrandom();
    //var randomseed=Math.random().toString(36).substring(7);
    //console.log('seed is: ',randomseed)
    var rng;
    rng=uiEngine.getNewRandom(seed)//randomseed)
    var displaySpec=uiEngine.fillSpecifications(seed)


    var scheme = new ColorScheme;
    scheme.add_complement(true)
    scheme.from_hue(displaySpec.schemeHue)//Math.floor(140+rng.random() * (340-140)))//getRandomInt(0,360)-1)         // Start the scheme
      .scheme('analogic')     // Use the 'triade' scheme, that is, colors
                            // selected from 3 points equidistant around
                            // the color wheel.
      .variation(displaySpec.schemeColorVariation)//'default');   // Use the 'soft' color variation
    var colors = scheme.colors();
    document.body.style.background='#'+colors[1]
    uiEngine.setStyle('a:hover,a:focus{color: #'+colors[11]+';}')

    console.log('darkness of color 4 ',uiEngine.getDarkness(colors[4]))
    var boxcolor=colors[4]
    var fieldColor=colors[5]
    if(uiEngine.getDarkness(colors[4])>410){
    boxcolor=colors[5]
    fieldColor=colors[4]
    }
    uiEngine.setStyle('input{background-color: #'+fieldColor+';}')
    uiEngine.setStyle('.controlbox{background-color: #'+boxcolor+';}')
    uiEngine.setStyle('.infotext{color: #'+colors[3]+';}')
    uiEngine.setStyle('.highlighttext{color: #'+colors[12]+';}')
    uiEngine.setStyle('.highlighttextsubtle{color: #'+colors[15]+';}')
    uiEngine.setStyle('.custombuttoncolor{background-color: #'+colors[1]+';}')
    //.custombutton:
    uiEngine.setStyle('.custombuttoncolor:hover{background-color: #'+colors[0]+';}')
    console.log('colors',colors)

    //set background
    var canvas=document.createElement('CANVAS');
    canvas.width=1000
    canvas.height=500
    var colorsCopy=colors.slice();

    var bgMethod=displaySpec.bgMethod//Math.floor(rng.random()*3);
    var dataUrl;
    if(bgMethod==0){
      var opts = {
              ShowDebug: false,
              MonochromaticOnly: true,
              colorsToUse: colorsCopy.slice(0,4).splice(0,2),
              random:uiEngine.getNewRandom(displaySpec.bg0seed),
          };
      console.log('colorsafter',colors)
      GenerateMatBG(canvas,opts)
      console.log('colorsafter2',colors)
      dataUrl="url(" +canvas.toDataURL() + ") ";
    }
    if(bgMethod==1){
      var colors2=colorsCopy.slice(0,4).splice(0,2)
      console.log('colors2',colors2)
      var localrng=uiEngine.getNewRandom(displaySpec.bg1seed)
      var pattern = Trianglify({
        height: window.innerHeight,
        width: window.innerWidth,
        cell_size: 30 + localrng.random() * 100,
        seed:displaySpec.bg1seed,//uiEngine.getRandomSeed(rng),
        x_colors:uiEngine.randChoice([['#FFFFFF', colorsCopy[0], '#000000'],['#000000', colorsCopy[0], '#FFFFFF'],['#D8D8D8', colorsCopy[0], '#424242']],localrng),
        y_colors:uiEngine.randChoice([false,['#FFFFFF', colorsCopy[0], '#000000'],['#000000', colorsCopy[0], '#FFFFFF'],['#D8D8D8', colorsCopy[0], '#424242']],localrng)});//false})//['#FFFFFF', colorsCopy[0], '#000000']['#000000', colorsCopy[0], '#FFFFFF']
      canvas=pattern.canvas();
      dataUrl="url(" +canvas.toDataURL() + ") ";
    }
    if(bgMethod==2){
      var pattern = GeoPattern.generate(displaySpec.bg2seed,{'color':colors[0]});
      dataUrl=pattern.toDataUrl()//pattern.toDataURL()
      //console.log('geopattern output '+pattern.toDataUrl());
    }
    if(bgMethod==3){
      var localseed=displaySpec.bg3seed//uiEngine.getRandomSeed(rng)
      console.log('bgmethod 3 local seed ',localseed)
      localrng=uiEngine.getNewRandom(localseed)
      //console.log('localrngright? ',localrng.getRandomInt(360))
      var generator = new ColorfulBackgroundGenerator();
      generator.addLayer(new ColorfulBackgroundLayer({degree: localrng.getRandomInt(360), h: localrng.getRandomInt(360), s: 0.95, l: 0.55,posColor: 100})); // bottom layer
      generator.addLayer(new ColorfulBackgroundLayer({degree: localrng.getRandomInt(360), h: localrng.getRandomInt(360), s: 0.9, l: 0.7, posColor: 30, posTransparency: 80}));
      generator.addLayer(new ColorfulBackgroundLayer({degree: localrng.getRandomInt(360), h:localrng.getRandomInt(360), s: 0.95, l: 0.7, posColor: 10, posTransparency: 80}));
      generator.assignStyleToElement(document.body);
      dataUrl=false
    }
    //console.log('canvas is ',canvas)
    if(dataUrl){
      document.body.style.background = dataUrl ;
    }
    document.body.style['background-size']="1500px 900px"
  }
}
