# ME_SimpleExpMultplier
A simple plugin so actors get different exp depending on conditions. Can be used as a core.

This plugin allows you to manage character exp rate mid-game.
By default, you can only change it with items, and equipment, but this plugin allows you to manage it with two commands, one to add and lower exp rate, and another to set the exp rate. What's more, it lets you to change everyone's exp rate at the same time, unlike the editor.
This only changes actor exp rate trait, not item traits, so they still stack together, so if your actor gets 100% exp at start, gets a exp rate sword with 50% exp rate, and does exp rate quests 10% each, they can have 60, 70, 80 percent extra exp.
You can use both actual numbers or a editor variable so the player actions affect the bonus.

Let's say actor does 10 exp quests, and they won't get their exp bonus until they are all finished. You go recording every success into variable 4. Then, actor fails 3 of these quests, so variable 4 contains 10 - 3 = 7. We copy variable 4 into variable 5, then, (variable 5) * 10 = 70. You only need to use "ME_SEM Add 1 v5" without quotation marks, assuming 1 is the actor you want to give the bonus to!

You can also do it reverse ways:
Player has to do the same quest with different characters one at once, then, you record which actor did better, so "ME_SEM Add v5 50" will add 50% exp rate to actor whose index is in variable number 5.

The plugin was also meant to be in consideration of editor add experience command and items.

Let's say Harold and Therese skipped class to find a monster. Marsha and Lucius stay in class because it didn't do anything yet.
Harold and Therese get a exp book item, which gives the party 100 exp points. But Marsha and Lucius now understand more of the book, so they get 120 exp points each.

This functionality can be disabled from parameters. In a short future upgrade I'll make a plugin command to modify it mid-game.

On a side note, this plugin is quite dangerous to use with other plugins that manage exp, exp rate or traits, like YEP Special Parameters or or xparams. Use at your own risk!

