const { ipcMain } = require('electron');
const SerialPort = require('serialport');
const { channels } = require('../src/shared/constants');

const init = async () => {
    try {
        const ports = await SerialPort.list();
        ipcMain.on(channels.SERIALPORT_LIST, (event, arg) => {
            event.sender.send(channels.SERIALPORT_LIST, { ports });
        });
    } catch (error) {
        console.log(error);
    }

    ipcMain.on(channels.SERIALPORT_CONNECT, (event, arg) => {
        const port = new SerialPort(arg.path, { baudRate: 115200 });

        port.on("open", () => {
            event.sender.send(channels.SERIALPORT_CONNECTED);
        });

        ipcMain.on(channels.SERIALPORT_SEND, (event, msg) => {
            console.log(msg);
            port.write(msg, (err) => {
                if (err) {
                    return console.log('Error: ', err.message);
                }
            });
        });
    });
};

module.exports = {
    init,
};
