/* this is useful when theming portal to find the right variant of a color and stay close to Branding */
function getEquivalentOpaqueRGB(R,G,B,O){
var newR = _convertPartial(R);
var newG = _convertPartial(G);
var newB = _convertPartial(B);

return [newR,newG,newB].join(',');
}

function _convertPartial(partialRGB){
return parseInt(255 - O*(255-RGBPartial));
}
