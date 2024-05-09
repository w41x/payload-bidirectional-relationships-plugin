// init replica set
try {
    rs.status();
} catch (e) {
    rs.initiate({
        _id: 'rs0',
        members: [
            {_id: 0, host: 'db'}
        ]
    });
}

// init cms database & create user for the API if absent
var be_cms = db.getSiblingDB('cms')
if (!be_cms.getUser('api')) {
    be_cms.runCommand({
        createUser: 'api',
        pwd: 'secret',
        roles: [{role: 'readWrite', db: 'cms'}]
    });
}

