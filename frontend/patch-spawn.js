if (process.platform === 'win32') {
    const cp = require('child_process');
    const cmds = ['npm', 'npx', 'vercel'];
    const origSpawn = cp.spawn;
    cp.spawn = function (cmd, args, opts) {
        if (typeof cmd === 'string' && cmds.includes(cmd)) {
            cmd = cmd + '.cmd';
            opts = { ...opts, shell: true };
        }
        return origSpawn.call(cp, cmd, args, opts);
    };
    const origExec = cp.exec;
    cp.exec = function (cmd, opts, cb) {
        return origExec.call(cp, cmd, opts, cb);
    };
}
