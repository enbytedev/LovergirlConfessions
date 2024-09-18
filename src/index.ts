import startExpress from './express/express.js';
import {configureLogger} from './setup/mainLogger.js';
import kitchenlight from 'kitchenlight'; // Import kitchenlight to use it's debugger tools. It doesn't need to be used in the code.
kitchenlight.applyToConsole(); // Apply kitchenlight to the console.

configureLogger();
startExpress();