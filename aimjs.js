"use strict";
// autoimagemorphjs / aimjs : Automatic image morphing ; András Jankovics, 2020, andras@jankovics.net ; https://github.com/jankovicsandras/
// License: Public Domain / https://unlicense.org/
var fs = require("fs"), PNG = require("./pngjs-master/lib/png").PNG; // https://github.com/lukeapage/pngjs

function loadpng( filename ){ return PNG.sync.read(fs.readFileSync(filename)); }
function savepng( filename, pngd, options ){ fs.writeFileSync(filename, PNG.sync.write(pngd, options)); }
function newpng( oldpng ){ return new PNG({filterType: -1, width: oldpng.width, height: oldpng.height }); }
function newpng2( w, h ){ return new PNG({filterType: -1, width: w, height: h }); }

// get 2 textured triangles from inpng1 and inpng2 at inncoords1, incoords2 with subpixel precision; mix the coords and textures at alfa; draw to outpng at outcoords
function tridraw( inpng1, inpng2, outpng, incoords1, incoords2, outcoords, alfa, subpixel ){
    // vectors init
    var bdx = outcoords[2][0]-outcoords[0][0], bdy = outcoords[2][1]-outcoords[0][1];
    var adx = outcoords[2][0]-outcoords[1][0], ady = outcoords[2][1]-outcoords[1][1];
    var bl = Math.hypot( bdx, bdy ), al = Math.hypot( adx, ady );
    if(bl===0 || al===0){ return; }
    var inbdx1 = incoords1[2][0]-incoords1[0][0], inbdy1 = incoords1[2][1]-incoords1[0][1];
    var inadx1 = incoords1[2][0]-incoords1[1][0], inady1 = incoords1[2][1]-incoords1[1][1];
    var inbl1 = Math.hypot( inbdx1, inbdy1 ), inal1 = Math.hypot( inadx1, inady1 );
    if(inbl1===0 || inal1===0){ return; }
    var inbdx2 = incoords2[2][0]-incoords2[0][0], inbdy2 = incoords2[2][1]-incoords2[0][1];
    var inadx2 = incoords2[2][0]-incoords2[1][0], inady2 = incoords2[2][1]-incoords2[1][1];
    var inbl2 = Math.hypot( inbdx2, inbdy2 ), inal2 = Math.hypot( inadx2, inady2 );
    if(inbl2===0 || inal2===0){ return; }
    // swap to work on longer tri side
    if( al > bl ){
        outcoords[3]=outcoords[0]; outcoords[0]=outcoords[1]; outcoords[1]=outcoords[3];
        bdx = outcoords[2][0]-outcoords[0][0], bdy = outcoords[2][1]-outcoords[0][1];
        adx = outcoords[2][0]-outcoords[1][0], ady = outcoords[2][1]-outcoords[1][1];
        bl = Math.hypot( bdx, bdy ), al = Math.hypot( adx, ady );
        incoords1[3]=incoords1[0]; incoords1[0]=incoords1[1]; incoords1[1]=incoords1[3];
        inbdx1 = incoords1[2][0]-incoords1[0][0], inbdy1 = incoords1[2][1]-incoords1[0][1];
        inadx1 = incoords1[2][0]-incoords1[1][0], inady1 = incoords1[2][1]-incoords1[1][1];
        inbl1 = Math.hypot( inbdx1, inbdy1 ), inal1 = Math.hypot( inadx1, inady1 );
        incoords2[3]=incoords2[0]; incoords2[0]=incoords2[1]; incoords2[1]=incoords2[3];
        inbdx2 = incoords2[2][0]-incoords2[0][0], inbdy2 = incoords2[2][1]-incoords2[0][1];
        inadx2 = incoords2[2][0]-incoords2[1][0], inady2 = incoords2[2][1]-incoords2[1][1];
        inbl2 = Math.hypot( inbdx2, inbdy2 ), inal2 = Math.hypot( inadx2, inady2 );
    }// End of swap
    
    // iterate on b side, get pb, pa
    var itarg = Math.floor(bl*subpixel), iprog = 0, jprog = 0, pa = [0,0], pb = [0,0], ps = [0,0], sl = 0, idx1 = 0, idx2 = 0, idx3 = 0, inpa1 = [0,0], inpb1 = [0,0], inps1 = [0,0], inpa2 = [0,0], inpb2 = [0,0], inps2 = [0,0], ins1 = [0,0,0,0], ins2 = [0,0,0,0];
    for(var i=0; i<itarg; i++){
        iprog = i/itarg;
        pb = [ outcoords[0][0]+bdx*iprog, outcoords[0][1]+bdy*iprog ];
        pa = [ outcoords[1][0]+adx*iprog, outcoords[1][1]+ady*iprog ];
        inpb1 = [ incoords1[0][0]+inbdx1*iprog, incoords1[0][1]+inbdy1*iprog ];
        inpa1 = [ incoords1[1][0]+inadx1*iprog, incoords1[1][1]+inady1*iprog ];
        inpb2 = [ incoords2[0][0]+inbdx2*iprog, incoords2[0][1]+inbdy2*iprog ];
        inpa2 = [ incoords2[1][0]+inadx2*iprog, incoords2[1][1]+inady2*iprog ];

        sl = Math.hypot( pb[0]-pa[0], pb[1]-pa[1] );
        // iterate on pb-pa line, ps is the output coordinates
        for(var j=0; j<Math.floor(sl*subpixel); j++){
            jprog = j/Math.floor(sl*subpixel);
            // sample coordinates
            ps = [ pb[0]+(pa[0]-pb[0])*jprog, pb[1]+(pa[1]-pb[1])*jprog ];
            inps1 = [ inpb1[0]+(inpa1[0]-inpb1[0])*jprog, inpb1[1]+(inpa1[1]-inpb1[1])*jprog ];
            inps2 = [ inpb2[0]+(inpa2[0]-inpb2[0])*jprog, inpb2[1]+(inpa2[1]-inpb2[1])*jprog ];
            ins1=[0,0,0,0], ins2=[0,0,0,0];
            // RGBA values if on image
            if( inps1[0]>=0 && inps1[0]<inpng1.width && inps1[1]>=0 && inps1[1]<inpng1.height ){
                idx2 = (inpng1.width * Math.floor(inps1[1]) + Math.floor(inps1[0]))*4;
                ins1=[ inpng1.data[idx2  ], inpng1.data[idx2+1], inpng1.data[idx2+2], inpng1.data[idx2+3] ];
            }
            if( inps2[0]>=0 && inps2[0]<inpng2.width && inps2[1]>=0 && inps2[1]<inpng2.height ){
                idx3 = (inpng2.width * Math.floor(inps2[1]) + Math.floor(inps2[0]))*4;
                ins2=[ inpng2.data[idx3  ], inpng2.data[idx3+1], inpng2.data[idx3+2], inpng2.data[idx3+3] ];
            }
            // output draw, alfa blend
            if( ps[0]>=0 && ps[0]<outpng.width && ps[1]>=0 && ps[1]<outpng.height ){
                idx1 = (outpng.width * Math.floor(ps[1]) + Math.floor(ps[0]))*4;
                outpng.data[idx1  ] = Math.floor( ins1[0] * (1-alfa) + ins2[0] * alfa );
                outpng.data[idx1+1] = Math.floor( ins1[1] * (1-alfa) + ins2[1] * alfa );
                outpng.data[idx1+2] = Math.floor( ins1[2] * (1-alfa) + ins2[2] * alfa );
                outpng.data[idx1+3] = Math.floor( ins1[3] * (1-alfa) + ins2[3] * alfa );
            }
        }// End of iterate on pb-pa line, ps is the output coordinates
    }// End of iterate on b side, get pb, pa
}// End of tridraw()

// get an (n+1) * (m+1) grid of feature points on biggest contrast closest to cell center
function getfeaturepoints( png, n, m ){
    var fpts = []; if( n<1 || m<1 ){ return fpts; }
    var cw = png.width/n, ch = png.height/m, ccx = 0, ccy = 0, fc = 0, fd = png.height+png.width, tc = 0, idx = 0;
    // loop (m+1) * (n+1) to create feature point grid
    for(var j=0; j<=m; j++){
        fpts[j] = [];
        for(var i=0; i<=n; i++){
            fpts[j][i] = [ i*cw, j*ch ]; // cell centers
            // if feature point is not on image edge, search for biggest contrast, closest to cell center
            if( j>0 && j<m && i>0 && i<n ){
                fd = png.height+png.width; // init featurepoint-cellcenter distance with a maximum
                fc=0;  // latest feature point contrast
                for(var y=0; y<ch; y++){ for(var x=0; x<cw; x++){
                        idx = ( png.width * Math.floor(y+j*ch-ch/2) + Math.floor(x+i*cw-cw/2) )*4;
                        // tc: this contrast is the sum of absolute RGBA difference between this pixel and the right, left, down, up neighbors
                        tc = 0;
                        tc += Math.abs( png.data[idx  ] - png.data[idx+4] ); tc += Math.abs( png.data[idx+1] - png.data[idx+5] ); tc += Math.abs( png.data[idx+2] - png.data[idx+6] ); tc += Math.abs( png.data[idx+3] - png.data[idx+7] );
                        tc += Math.abs( png.data[idx  ] - png.data[idx-4] ); tc += Math.abs( png.data[idx+1] - png.data[idx-3] ); tc += Math.abs( png.data[idx+2] - png.data[idx-2] ); tc += Math.abs( png.data[idx+3] - png.data[idx-1] );
                        tc += Math.abs( png.data[idx  ] - png.data[idx+png.width  ] ); tc += Math.abs( png.data[idx+1] - png.data[idx+png.width+1] ); tc += Math.abs( png.data[idx+2] - png.data[idx+png.width+2] ); tc += Math.abs( png.data[idx+3] - png.data[idx+png.width+3] );
                        tc += Math.abs( png.data[idx  ] - png.data[idx-png.width  ] ); tc += Math.abs( png.data[idx+1] - png.data[idx-png.width+1] ); tc += Math.abs( png.data[idx+2] - png.data[idx-png.width+2] ); tc += Math.abs( png.data[idx+3] - png.data[idx-png.width+3] );
                        // if this contrast is the same as the latest, but closer; or this contrast is bigger; this is the new feature point
                        if( (tc===fc && Math.hypot(x-cw/2,y-ch/2)<fd) || (tc>fc) ){
                            fpts[j][i] = [(x+i*cw-cw/2),(y+j*ch-ch/2)];
                            fc = tc;
                            fd = Math.hypot(x-cw/2,y-ch/2);
                        }
                } }// End of x and y loops
            }// End of inner feature point test
        }// End of i loop
    }// End of j loop
    return fpts;
}// End of getfeaturepoints()

// display feature points for testing
function drawfeaturepoints( png, fpts, col ){
    for(var j=0; j<fpts.length; j++){ for(var i=0; i<fpts[j].length; i++){
            var idx = (png.width * Math.floor(fpts[j][i][1]) + Math.floor(fpts[j][i][0]))*4;
            png.data[idx  ] = col[0]; png.data[idx+1] = col[1]; png.data[idx+2] = col[2]; png.data[idx+3] = col[3];
    } }
}// End of drawfeaturepoints()

// get an interpolated frame from 2 source images mixed at alfa; draw to outpng
function getframe( png1, png2, outpng, fpts1, fpts2, alfa, subpixel ){
    for(var j=0; j<fpts1.length-1; j++){ for(var i=0; i<fpts1[j].length-1; i++){ // iterate on feature point grid, each quad is drawn as 2 triangles
            tridraw( png1, png2, outpng, 
                [ fpts1[j][i], fpts1[j][i+1], fpts1[j+1][i] ], // inpng1 feature point triange 1
                [ fpts2[j][i], fpts2[j][i+1], fpts2[j+1][i] ], // inpng2 feature point triange 1
                [ [ fpts1[j][i][0]*(1-alfa)+fpts2[j][i][0]*alfa , fpts1[j][i][1]*(1-alfa)+fpts2[j][i][1]*alfa ], 
                  [ fpts1[j][i+1][0]*(1-alfa)+fpts2[j][i+1][0]*alfa , fpts1[j][i+1][1]*(1-alfa)+fpts2[j][i+1][1]*alfa ], 
                  [ fpts1[j+1][i][0]*(1-alfa)+fpts2[j+1][i][0]*alfa , fpts1[j+1][i][1]*(1-alfa)+fpts2[j+1][i][1]*alfa ] ], // out triange 1 interpolated at alfa
                alfa, subpixel );
            tridraw( png1, png2, outpng, 
                [ fpts1[j][i+1], fpts1[j+1][i+1], fpts1[j+1][i] ], // inpng1 feature point triange 2
                [ fpts2[j][i+1], fpts2[j+1][i+1], fpts2[j+1][i] ], // inpng2 feature point triange 2
                [ [ fpts1[j][i+1][0]*(1-alfa)+fpts2[j][i+1][0]*alfa , fpts1[j][i+1][1]*(1-alfa)+fpts2[j][i+1][1]*alfa ], 
                  [ fpts1[j+1][i+1][0]*(1-alfa)+fpts2[j+1][i+1][0]*alfa , fpts1[j+1][i+1][1]*(1-alfa)+fpts2[j+1][i+1][1]*alfa ], 
                  [ fpts1[j+1][i][0]*(1-alfa)+fpts2[j+1][i][0]*alfa , fpts1[j+1][i][1]*(1-alfa)+fpts2[j+1][i][1]*alfa ] ], // out triange 1 interpolated at alfa
                alfa, subpixel );
    } }// End of i and j loops
}// End of getframe()

// render and save all frames between a list of keyframes
function anim( keyframefilenames, outfileprefix, framerate, featuregridwidth, featuregridheight, subpixel, pngopts ){
    pngopts = pngopts || {};
    var inpngs = [], fpts = [0], outpng, filename, iw, ih;
    inpngs[0] = loadpng( keyframefilenames[0] ); // load first keyframe
    iw = inpngs[0].width; ih = inpngs[0].height;
    fpts[0] = getfeaturepoints( inpngs[0], featuregridwidth, featuregridheight );
    // loop on keyframes, "swap" load only the next
    for(var i=1; i<keyframefilenames.length; i++){
        outpng = newpng2( iw, ih ); // new output png
        inpngs[i%2] = loadpng( keyframefilenames[i] ); // "swap" load only the next keyframe
        fpts[i%2] = getfeaturepoints( inpngs[i%2], featuregridwidth, featuregridheight );
        // loop to render interframes
        for(var j=0; j<framerate; j++){
			var starttime = Date.now();
            getframe( inpngs[(i-1)%2], inpngs[i%2], outpng,fpts[(i-1)%2], fpts[i%2], j/framerate, subpixel );
            filename = outfileprefix + ((i-1)*framerate+j) + '.png';
            savepng( filename, outpng, pngopts );
            console.log( filename + ' saved. '+(Date.now()-starttime)+' s' );
        }
    }
}// End of anim()

// command line interface
var helptext = '\r\n\r\n autoimagemorphjs / aimjs : Automatic image morphing\r\n András Jankovics, 2020, andras@jankovics.net\r\n https://github.com/jankovicsandras/\r\n License: Public Domain / https://unlicense.org/ \r\n\r\n Usage: \r\n\r\n     node aimjs -i vg0.png vg30.png -o f\r\n\r\n this generates f*.pngs with defaults\r\n\r\n     node aimjs -i vg0.png vg30.png vg60.png vg0.png -o f_ -f 15 -w 3 -h 3\r\n\r\n this generates 3 x 15 f_*.pngs with 3 x 3 grid\r\n\r\n Options\r\n -i : REQUIRED flag to begin input filename list \r\n -o : REQUIRED flag to specify output filename prefix\r\n -f : framerate, optional integer, default = 30\r\n -w : feature grid width, optional integer, default = 6\r\n -h : feature grid height, optional integer, default = 6\r\n -sp : subpixel processing, optional float, default = Math.SQRT2\r\n -pngopts : optional object, see https://github.com/lukeapage/pngjs \r\n\r\n WARNING: this will overwrite <output_filename_prefix><sequencenumber>.png files without warning! In this example, f0.png , f1.png, ... f89.png will be overwritten.\r\n\r\n Recommended postprocessing: get FFmpeg from https://ffmpeg.org/\r\n\r\n    ffmpeg -framerate 30 -i f%d.png f.gif\r\n\r\n';

try{ 
	if(process.argv.length<3){ console.log(helptext); process.exit(); }
	var o = { '-i':[], '-o':[], '-f':['30'], '-w':['6'], '-h':['6'], '-sp':[(''+Math.SQRT2)], '-pngopts':['{}'] }, k = '-i';
	for(var i=2; i<process.argv.length; i++){ if(o.hasOwnProperty(process.argv[i])){ k = process.argv[i]; }else{ o[k].unshift(process.argv[i]); } }
    anim(o['-i'].reverse(), o['-o'][0], parseInt(o['-f'][0]), parseInt(o['-w'][0]), parseInt(o['-h'][0]), parseFloat(o['-sp'][0]), JSON.parse(o['-pngopts'][0]) );
}catch(ex){ console.log(ex+'\r\n\r\n--------------------------------\r\n\r\n'+helptext+'\r\n\r\n--------------------------------\r\n\r\n'+ex.stack); }

//anim( ['f0.png','f30.png','f60.png','f90.png','f120.png','f150.png','f0.png'], 'f', 30, 6, 6, 2 );



