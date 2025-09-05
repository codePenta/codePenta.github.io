import { IconsReader } from './modules/fileReader.js';
import { IconsWriter } from './modules/fileWriter.js';

var iconsReader = new IconsReader("programming");
iconsReader.resolveIconsPathForCategory();
var availableIcons = iconsReader.getIconsFromFiles(".svg");

var iconsWriter = new IconsWriter("programming");
iconsWriter.buildOutputPathForCategory();
iconsWriter.writeIconsFromSVG(availableIcons);