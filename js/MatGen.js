function GenerateMatBG(canvas,opts){
var shapes = new Array();
var paths = new Array();

var wconst=1000
var hconst=400

var width = wconst;
var height = hconst;

var randomGen=Math;

function getRandomInt(min, max) {
	return Math.floor(randomGen.random() * (max - min + 1) + min);
}

var paletaEnSecuencia = true;
var indiceColor = 0;
var colors ;
var colBlocks = '';

var  scheme = new ColorScheme;

function generateColors() {
	colors = scheme.colors();
	colBlocks = '';
	for (var i in colors) {
		var c = colors[i];
		colBlocks = colBlocks + '<div class="color"  style="background-color: #' + c + '"></div>';
	}
	$("#divCols").html( colBlocks);
}
function setHue(hue) {
	var clSchemes = new Array();
	clSchemes[0] = 'monochromatic';
	clSchemes[1] = 'contrast';
	clSchemes[2] = 'triade';
	clSchemes[3] = 'tetrade';
	clSchemes[4] = 'analogic';

	scheme.from_hue(hue)
	.scheme(_opts.MonochromaticOnly ? clSchemes[0] : clSchemes[getRandomInt(0,4)])
	.distance(1)
	.add_complement(true)
	.web_safe(true);
	generateColors();
}

var _opts = null;
function Generate(canvas,opts)
{
	if(opts == null){opts = _opts}else{_opts= opts;}
	if(opts.random){
		randomGen=opts.random;
	}
	paper.setup(canvas);
	if(!opts.colorsToUse){
		setHue(getRandomInt(0,360)-1);
	}
	else{
		colors=opts.colorsToUse
	}

	var debug = "";

	var color ="#"+colors[getRandomInt(0,colors.length-1)];
	var path = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Point(wconst*4, wconst*4));
	path.style = {fillColor: new paper.Color(color)};
	inicial = false;

	var efectoreplica = false;
	var horizontal = false;
	var inclinado = false;
	var opuestoReplicaAngulo = false;
	var distanciaEntreOpuestos = 0;
	var circulo = false;

	for(var i = 0; i < getRandomInt(5,500); i++)
	{
		if(paletaEnSecuencia)
		{
			indiceColor++;
			if(indiceColor >= colors.length)
			{
				indiceColor = 0;
			}
		}
		else
		{
			indiceColor = getRandomInt(0,colors.length-1);
		}


		var color ="#"+colors[indiceColor];

			if(!efectoreplica)
			{
				circulo = getRandomInt(0,3) == 0;
			}
			if(circulo && !efectoreplica)
			{
				myPath = new paper.Path.Circle(new paper.Point(getRandomInt(0,wconst), getRandomInt(0,hconst)), getRandomInt(0,hconst));
			}
			else
			{
				myPath = new paper.Path();
			}

			myPath.style = {
				fillColor: new paper.Color(color),
				strokeWidth: 0,
				shadowColor : ' rgba(0,0,0,0.01)',
				shadowBlur : 20,
				shadowOffset:1
			};


		if(efectoreplica)
		{
			var myPath =paths[i-1].clone();
			myPath.style = {

			fillColor: new paper.Color(color),
			strokeWidth: 0,
			shadowColor : ' rgba(0,0,0,0.01)',
			shadowBlur : 20,
			shadowOffset:1
			};

			distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
			while(Math.abs(distanciaEntreOpuestos) < 20 )
			{
				distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
			}
			if(circulo)
			{var scale = 1-(getRandomInt(1,5)/10);
				myPath.scale(scale);
			}
			else
			{
				if(distanciaEntreOpuestos < 0)
				{
					if(horizontal)
					{
						//mover arriba
						myPath.translate(0,- Math.abs(distanciaEntreOpuestos));
					}
					else
					{
						//mover izquierda
						myPath.translate(- Math.abs(distanciaEntreOpuestos), 0);
					}
				}
				else
				{
					if(horizontal)
					{
						//mover abajo
						myPath.translate(0,Math.abs(distanciaEntreOpuestos));
					}
					else
					{
						//mover derecha
						myPath.translate(Math.abs(distanciaEntreOpuestos), 0);
					}
				}
			}
		}
		else if(!circulo)
		{
			horizontal = getRandomInt(0,1) == 0;
			inclinado = getRandomInt(0,1) == 0;
			opuestoReplicaAngulo = getRandomInt(0,1) == 0;


			if(horizontal)
			{
				distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
				while(Math.abs(distanciaEntreOpuestos) < 20 )
				{
					distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
				}

				//crear una linea horizontal
				var p1 = new paper.Point(0,getRandomInt(0,hconst));
				var p2 = new paper.Point(wconst,inclinado ? getRandomInt(0,hconst) : p1.y);

				var p4 = new paper.Point(0,opuestoReplicaAngulo ? p1.y + distanciaEntreOpuestos : hconst);
				var p3 = new paper.Point(wconst,opuestoReplicaAngulo ? p2.y + distanciaEntreOpuestos : hconst);

				myPath.add(p1);
				myPath.add(p2);
				myPath.add(p3);
				myPath.add(p4);
			}
			else
			{
				distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
			while(Math.abs(distanciaEntreOpuestos) < 20)
			{
				distanciaEntreOpuestos = getRandomInt(-hconst,hconst);//que no se pase...
			}

			//crear una linea vertical
			var p1 = new paper.Point(getRandomInt(0,wconst), 0);
			var p2 = new paper.Point(inclinado ? getRandomInt(0,wconst) : p1.x, hconst);

			var p4 = new paper.Point(opuestoReplicaAngulo ? p1.x + distanciaEntreOpuestos : wconst, 0);
			var p3 = new paper.Point(opuestoReplicaAngulo ? p2.x + distanciaEntreOpuestos : wconst, hconst);

			myPath.add(p1);
			myPath.add(p2);
			myPath.add(p3);
			myPath.add(p4);

		}
	}
	var booleano = false;
	if(getRandomInt(0,3) == 1 && i > 0 )//&& !efectoreplica)
	{
			 booleano= true;
	debug += "<div class='color' style='display:block;background-color: " + color + "'>clone</div>" ;

		var pathx = paths[i-1].clone();
		var operacion = getRandomInt(0,10);
		if(operacion==1)
		{
			myPath.unite(pathx);
		}
		if(operacion==2)
		{
			myPath.intersect(pathx);
		}
		if(operacion>=3)
		{
			myPath.divide(pathx);
		}
		if(operacion==0)
		{
			myPath.subtract(pathx);
		}
		if(operacion==0)
		{
			myPath.exclude(pathx);
		}
		pathx.visible = false;
		myPath.style = {

			fillColor: new paper.Color("#"+colors[getRandomInt(0,colors.length-1)]),
			strokeWidth: 0,
			shadowColor : ' rgba(0,0,0,0.01)',
			shadowBlur : 20,
			shadowOffset:1
			};


	}
	paths[i] = myPath;

	myPath.closed = true;
	debug += "<div class='color' style='display:block;background-color: " + color + "'>"+i + " / "+ (booleano ? "boolean" : "") + " / "  + (efectoreplica ? "clone" : "") + " / " + (circulo ? "circle" : "") + "</div>" ;
	efectoreplica =  getRandomInt(0,1) == 0;
	}
	if(opts.ShowDebug)
	{
	document.getElementById("x").innerHTML=debug;
	}
	paper.view.draw();
}

	Generate(canvas,opts);
}
