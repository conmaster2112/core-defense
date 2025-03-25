import { Game } from "./game/game";
import { UIManager } from "./managers";

//localStorage.clear();
const game = new Game(UIManager.context);
game.optionsShowStats = true;
game.optionsResolution = 1024;
game.start();