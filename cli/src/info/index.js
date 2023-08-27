const { program } = require('commander');
import Config from '../config';

program
    .name(Config.Info.Name)
    .description(Config.Info.Descriptions)
    .version(Config.Info.Version);
