import { Game } from "./game/game";
import { uiManager } from "./managers";

const game = new Game(uiManager.context);
game.optionsShowStats = true;
game.optionsResolution = 1024;
game.start();