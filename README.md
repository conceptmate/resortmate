### Errors

## Not migrating, control is locked

Migrations set a lock when they are migrating, to prevent multiple instances of your clustered app from running migrations simultaneously. If your migrations throw an exception, you will need to manually remove the lock (and ensure your db is still consistent) before re-running the migration. Update the migrations collection like this:

```
$ meteor mongo
```

```
db.migrations.update({_id:"control"}, {$set:{"locked":false}});
```

```
exit
```

## Create Self-signed certificate

https://help.ubuntu.com/12.04/serverguide/certificates-and-security.html

## Mail configuration

MAIL_URL smtp://mail@example.com:PASSWORD@mail.example.com:587/
