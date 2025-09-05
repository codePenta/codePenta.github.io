import { IconsReader } from '../fileReader.js';
import { IconsWriter } from '../fileWriter.js';

var iconsReader = new IconsReader("versionControl");
iconsReader.resolveIconsPathForCategory();
var availableIcons = iconsReader.getIconsFromFiles(".svg");

var iconsWriter = new IconsWriter("versionControl");
iconsWriter.buildOutputPathForCategory();
iconsWriter.writeIconsFromSVG(availableIcons);