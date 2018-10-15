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
  transformSite:function(seed){
    // Use "new" to create a local prng without altering Math.random.
    //var myrng = new Math.seedrandom('hello.');
    //Math.seedrandom();
    //var randomseed=Math.random().toString(36).substring(7);
    //console.log('seed is: ',randomseed)
    var rng=new Math.seedrandom('g2jkv')//randomseed)
    rng.random=rng.quick
    var scheme = new ColorScheme;
    scheme.add_complement(true)
    scheme.from_hue(Math.floor(rng.random() * 360))//getRandomInt(0,360)-1)         // Start the scheme
      .scheme('analogic')     // Use the 'triade' scheme, that is, colors
                            // selected from 3 points equidistant around
                            // the color wheel.
      .variation('default');   // Use the 'soft' color variation
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
    var opts = {
            ShowDebug: false,
            MonochromaticOnly: true,
            colorsToUse: colorsCopy.slice(0,4).splice(0,2),
            random:rng,
        };
    console.log('colorsafter',colors)
    GenerateMatBG(canvas,opts)
    console.log('colorsafter2',colors)
    document.body.style.background = "url(" + canvas.toDataURL() + ") ";
    document.body.style['background-size']="1500px 900px"
  }
}
