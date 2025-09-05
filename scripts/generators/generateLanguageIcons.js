import { IconsReader } from './fileReader.js';
import { IconsWriter } from './fileWriter.js';

var iconsReader = new IconsReader("programming");
iconsReader.resolveIconsPathForCategory();
var availableIcons = iconsReader.getIconsFromFiles(".svg");

var iconsWriter = new IconsWriter("programming");
iconsWriter.buildOutputPathForCategory();
iconsWriter.writeIconsFromSVG(availableIcons);