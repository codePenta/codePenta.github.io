import { IconsReader } from './modules/fileReader.js';
import { IconsWriter } from './modules/fileWriter.js';

var iconsReader = new IconsReader("versionControl");
iconsReader.resolveIconsPathForCategory();
var availableIcons = iconsReader.getIconsFromFiles(".svg");

var iconsWriter = new IconsWriter("versionControl");
iconsWriter.buildOutputPathForCategory();
iconsWriter.writeIconsFromSVG(availableIcons);