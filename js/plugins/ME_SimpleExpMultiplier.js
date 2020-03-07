/*:
 * @plugindesc A plugin to manage exprates.
 *
 * @author myenemy
 * 
 * @param Use exprate on change exp
 * @desc Apply exprate for editor exp addition.
 * @type boolean
 * @default true
 *
 * @help
 * This plugin will allow you to manage exp rate mid game.
 * By default, it's locked by data base configurations, gear worn, items... But now you can make tasks to change it!
 * Of course, you can combine this to make more complex calculations... by using normal variables!
 * It will also consider if you add exp from change exp, if you want to!
 * Warning, this plugin can be highly incompatible with any others that manage exp other than ME_SharedExp!
 * 
 * Plugin commands
 *  ME_SEM add x y
 *  ME_SEM set x y
 * 
 * You can use variables instead raw numbers too, just type any letter plus the variable, like "v5", and you will use var number 5 instead a number!
 * 
 * @Terms of use
 * - Common:
 * -  Free to use as in money.
 * -  Feel free to modify to redistribute it.
 * -  This plugin comes as is, with no guarantees.
 * -  I'll try to give support about it, but I can't say I will do it for sure.
 * - Non Commercial:
 * -  No credit required unless you modify it then credit yourself, in other words,
 *   no claiming as your own!
 * - Commercial:
 * -  Give credit me as the author of this plugin, I don't mind if you do so in some
 *   scene or some easter egg.
 * -  Report any bugs, incompatibilities and issues with this plugin to me, even if
 *   you have someone else fixing them.
 * 
 * 
 * @devNotes
 * 1. Mob exp goes for the function "gainExp", which multiplies the exp by the exp rate, then calls "changeExp"
 * The editor option to give exp, and the items, go straight for "changeExp" function, so I had to void them
 * both, to manage them my own way
 * 2. Since I voided one function that calls another void function, if I call the first at some point, it will
 * try to call the second, which in turn will reset, starting a endless loop and crashing. In order to do this
 * I had to set again the functionality in my own function, instead calling the original ones
 */
var parameters = PluginManager.parameters('ME_SimpleExpMultiplier');
var _pluginCommand=Game_Interpreter.prototype.pluginCommand;


//var original_changeExp = Game_Actor.prototype.changeExp;
//var original_gainExp = Game_Actor.prototype.gainExp;

Game_Actor.prototype.gainExp = function(exp)
{
    this.ME_changeExp(exp, this.shouldDisplayLevelUp(), true);
};

Game_Actor.prototype.changeExp = function(exp, show)
{
    this.ME_changeExp(exp,show,parameters["Use exprate on change exp"]);
};

Game_Actor.prototype.ME_changeExp = function(exp, show, rate)
{
    if(rate)
    {
        var exp = this.currentExp() + Math.round(exp * this.finalExpRate());
    }
    
    this._exp[this._classId] = Math.max(exp, 0);
    var lastLevel = this._level;
    var lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};



Game_Actor.prototype.ME_setExpRate = function(rate,config)
{    
    var newRate=parseFloat(rate)/100.0;
    var traits=this.traitObjects()[1].traits;

    if (config==1)
    {
        traits.push({code:23,dataId:9,value:newRate})
    }
    else if (config==0)
    {
        var i = 0;
        while (i<traits.length)
        {
            if (traits[i].code==23&&traits[i].dataId==9)
            {
                traits.splice(i,1);
            }
            else
            {
                i++;
            }
        }
        traits.push(
            {
                code:23,
                dataId:9,
                value:newRate
            });
    }
    else
        console.log("There's no other config than add and set. You can use - to reduce")
}

Game_Player.prototype.ME_setExpRate = function(target, rate, config)
{
    console.log("ExpRate Player")
    if (isNaN(rate))

        rate=$gameVariables.value(parseInt(rate.substring(1)));
    
    if (isNaN(target))
        target=$gameVariables.value(parseInt(target.substring(1)));
    console.log(target+" "+rate)
    
    switch(parseInt(target))
    {
        case -1:
            for (var i=1;i<$gameActors._data.length;i++)
            {
                $gameActors.actor(i).ME_setExpRate(rate,config);
            }
            break;
        case 0:
            for (var i=0;i<$gameParty._actors.length;i++)
            {
                $gameActors.actor($gameParty._actors[i]).ME_setExpRate(rate,config);
            }
            break;
        default:
            $gameActors.actor(parseInt(target)).ME_setExpRate(rate,config);
    }
}


Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    var parseCommand=command.toLowerCase();
    
    if (parseCommand=="me_sem")
    {
        switch(args[0].toLowerCase())
        {
            case "add":
                $gamePlayer.ME_setExpRate(args[1],args[2],1);
                break;
            case "set":
                $gamePlayer.ME_setExpRate(args[1],args[2],0);
                break;        
        }
    }
    else
        _pluginCommand.call(this, command, args);
};
