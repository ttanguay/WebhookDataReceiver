const Discord = require('discord.js');
const Embed_Config = require('../../config/embed_nests.js');

module.exports.run = async (MAIN, message, nest, server, embed_area, timezone) => {
      // CHECK IF THE TARGET IS A USER
      let member = MAIN.guilds.get(server.id).members.get(message.author.id);
      let pokemon = {type: '', color: '', form: '', area: embed_area}, role_id ='';

      // DETERMINE POKEMON NAME AND FORM
      pokemon.name = MAIN.pokemon[nest.pokemon_id].name;
      let form = 0;

      // GET STATIC MAP TILE
      if(MAIN.config.Map_Tiles == 'ENABLED'){
        pokemon.map_img = await MAIN.Static_Map_Tile(nest.lat, nest.lon, 'pokemon');
      }

      // DEFINE VARIABLES
      pokemon.time = await MAIN.Bot_Time(nest.updated, 'nest', timezone);
      pokemon.avg = nest.pokemon_avg;

      // GET POKEMON TYPE(S), EMOTE AND COLOR
      MAIN.pokemon[nest.pokemon_id].types.forEach((type) => {
        pokemon.type += MAIN.emotes[type.toLowerCase()]+' '+type+' / ';
        pokemon.color = MAIN.Get_Color(type, pokemon.color);
      }); pokemon.type = pokemon.type.slice(0,-3);

      // GET SPRITE IMAGE
      pokemon.sprite = await MAIN.Get_Sprite(form, nest.pokemon_id);
      pokemon.map_url = MAIN.config.FRONTEND_URL;
      pokemon.nest_name = nest.name;
      if (nest.nest_submitted_by !== null){
        pokemon.submitter = nest.nest_submitted_by;
      } else {
        pokemon.submitter = 'Map Scanned';
      }

      nest_embed = Embed_Config(pokemon);
      if(server.spam_channels.indexOf(message.channel.id) >= 0){
        return MAIN.Send_Embed('nest', 0, server, role_id, nest_embed, message.channel.id);
      } else {
        return MAIN.Send_DM(message.guild.id, message.author.id,nest_embed, message.author.bot);
      }
}
