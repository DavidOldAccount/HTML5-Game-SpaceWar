var maps = {
	"singleplayer":[
		{
			"name":"Entities",
			"briefing": "Arena mission!Have fun with them :)",			
			
			/* Map Details */
			"mapImage":"images/maps/arrena.png",			
			"startX":0,//2
			"startY":0,//3
			
			/* Map coordinates that are obstructed by terrain*/
			"mapGridWidth":60,
			"mapGridHeight":40,
			"mapObstructedTerrain":[
				[0, 0]
			],
			
			/* Entities to be loaded */
			"requirements":{
				"buildings":["base","starport","harvester","ground-turret"],
				"vehicles":["transport","harvester","scout-tank","heavy-tank"],
				"aircraft":["chopper","wraith"],
				"terrain":["oilfield","bigrocks","smallrocks"]
			},

			/* Entities to be added */
			"items":[
				{"type":"buildings","name":"base","x":7,"y":18,"team":"blue"},
				{"type":"buildings","name":"starport","x":7,"y":14,"team":"blue"},
				{"type":"vehicles","name":"harvester","x":7,"y":7,"team":"blue","direction":3},


				{"type":"vehicles","name":"scout-tank","x":26,"y":14,"team":"blue","direction":4,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"heavy-tank","x":26,"y":16,"team":"blue","direction":5,"orders":{"type":"sentry"}},
				{"type":"aircraft","name":"chopper","x":20,"y":12,"team":"blue","direction":2,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":23,"y":12,"team":"blue","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":27,"y":12,"team":"blue","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":29,"y":12,"team":"blue","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":31,"y":12,"team":"blue","direction":3,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"scout-tank","x":38,"y":14,"team":"blue","direction":4,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"heavy-tank","x":35,"y":16,"team":"blue","direction":5,"orders":{"type":"sentry"}},
//======================================================================================================================================================
			    
			    {"type":"vehicles","name":"scout-tank","x":43,"y":14,"team":"green","direction":4,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"heavy-tank","x":41,"y":16,"team":"green","direction":5,"orders":{"type":"sentry"}},
				{"type":"aircraft","name":"chopper","x":39,"y":12,"team":"green","direction":2,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":37,"y":12,"team":"green","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":48,"y":22,"team":"green","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":48,"y":25,"team":"green","direction":3,"orders":{"type":"sentry"}},
			    {"type":"aircraft","name":"wraith","x":45,"y":12,"team":"green","direction":3,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"scout-tank","x":44,"y":12,"team":"green","direction":4,"orders":{"type":"sentry"}},
			    {"type":"vehicles","name":"heavy-tank","x":35,"y":2,"team":"green","direction":5,"orders":{"type":"sentry"}},
				
				
				{"type":"buildings","name":"base","x":40,"y":28,"team":"green","uid":1},
				{"type":"buildings","name":"starport","x":45,"y":28,"team":"green"},
				{"type":"buildings","name":"harvester","x":48,"y":28,"team":"green"},
			],	

			/* Economy Related*/
			"cash":{
				"blue":50000,
				"green":5000
			},	
			"triggers":[//The time trigger
			    {"type":"timed", "time":1000,
			    "action":function(){
			    	game.showMessage("HINT", "Destroy The Enemy's Base!");
			    }
			   },
			    {"type":"timed", "time":4000,
			    "action":function(){
			    	game.showMessage("HINT", "If You Are Killed, Please Refresh The Page!");
			    }
			   },
			     
			   	{"type":"timed", "time":60000,
			    "action":function(){
			    	game.showMessage("WARNING:","Sevent AI Choppers Appeared!");
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":40, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":41, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":42, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":43, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":44, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":45, "team":"green", "orders":{"type":"hunt"}});
			    	game.add({"type":"aircraft", "name":"chopper", "x":-1, "y":46, "team":"green", "orders":{"type":"hunt"}});
			    }
			  },
			 ///////
			 
			   /*{"type":"conditional",
			   "condition":function(){
			   	return isItemDead(-1);
			   },
			   "action":function(){
			   	singleplayer.endLevel(false);
			   }
			  },*/
			  
			  {"type":"conditional",
			   "condition":function(){
			   	return isItemDead(1);
			   },
			   "action":function(){
			   	singleplayer.endLevel(true);
			   }
			  },
			  
			  {"type":"timed","time":30000,
			        "action":function(){
						game.showMessage("WARNING","Now Every EnemyUnit Are Going To Attack!");
						var units = [];
						for (var i=0; i < game.items.length; i++) {
							var item = game.items[i];
							if (item.team == "green" && (item.type == "vehicles"|| item.type == "aircraft")){
								units.push(item.uid);
							}
						};
						game.sendCommand(units,{type:"hunt"});			            
			        }
			    },
			 
			  //====================================================
			],	
		}
	]
}
